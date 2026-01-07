package com.plugin.appium;

import java.io.File;
import java.util.ArrayList;
import java.util.Map;
import java.util.logging.Logger;

import com.crestech.opkey.plugin.communication.message.AsynchronousEventChannel;
import com.crestech.opkey.plugin.communication.message.CryptoCallChannel;
import com.crestech.opkey.plugin.communication.message.DecryptionCallChannel;
import com.crestech.opkey.plugin.communication.message.FunctionCallChannel;
import com.crestech.opkey.plugin.communication.transport.TransportChannelFactory;
import com.crestech.opkey.plugin.communication.transport.TransportLayer;
import com.crestech.opkey.plugin.contexts.CommunicationProtocol;
import com.crestech.opkey.plugin.contexts.Context;
import com.crestech.opkey.plugin.contexts.SettingsLoader;
import com.crestech.opkey.plugin.eventhandling.CloseableThread;
import com.crestech.opkey.plugin.eventhandling.EventHandler;
import com.crestech.opkey.plugin.exceptionhandling.ExceptionHandler2;
import com.crestech.opkey.plugin.functiondispatch.ArgumentFormatter;
import com.crestech.opkey.plugin.functiondispatch.Dispatcher;
import com.crestech.opkey.plugin.functiondispatch.ExceptionHandler;
import com.crestech.opkey.plugin.functiondispatch.FunctionDispatchLoop;
import com.crestech.opkey.plugin.functiondispatch.LibraryLocator;
import com.crestech.opkey.plugin.logging.LogConfiguration;
import com.plugin.appium.exceptionhandlers.AdbNotFoundExceptionHandler;
import com.plugin.appium.exceptionhandlers.AppiumCliValidationFailExceptionHandler;
import com.plugin.appium.exceptionhandlers.AppiumServerBusyExceptionHandler;
import com.plugin.appium.exceptionhandlers.ElementNotExistInDropDownExceptionHandler;
import com.plugin.appium.exceptionhandlers.ElementNotVisibleExceptionHandler;
import com.plugin.appium.exceptionhandlers.InvalidCoordinatesExceptionHandler;
import com.plugin.appium.exceptionhandlers.InvalidElementStateExceptionHandler;
import com.plugin.appium.exceptionhandlers.InvalidSelectorExceptionHandler;
import com.plugin.appium.exceptionhandlers.NoSuchElementExceptionHandler;
import com.plugin.appium.exceptionhandlers.NoSuchWindowExceptionHandler;
import com.plugin.appium.exceptionhandlers.ObjectNotFoundExceptionHandler;
import com.plugin.appium.exceptionhandlers.SelendroidServerNeverStartExceptionHandler;
import com.plugin.appium.exceptionhandlers.SessionNotCreatedExceptionHandler;
//import com.plugin.appium.exceptionhandlers.SessionNotFoundExceptionHandler;
import com.plugin.appium.exceptionhandlers.StaleElementReferenceExceptionHandler;
import com.plugin.appium.exceptionhandlers.TimeoutExceptionHandler;
import com.plugin.appium.exceptionhandlers.ToolNotSetExceptionHandler;
import com.plugin.appium.exceptionhandlers.UnexpectedTagNameExceptionHandler;
import com.plugin.appium.exceptionhandlers.UnhandledAlertExceptionHandler;
import com.plugin.appium.exceptionhandlers.UnknownServerExceptionHandler;
import com.plugin.appium.exceptionhandlers.UnreachableBrowserExceptionHandler;
import com.plugin.appium.exceptionhandlers.UnsupportedCommandExceptionHandler;
import com.plugin.appium.exceptionhandlers.WebDriverExceptionHandler;

public class AppiumPlugin {

	static Logger logger = Logger.getLogger(AppiumPlugin.class.getName());

	public static void main(String[] args) throws Exception {

		/*
		 * 
		 * 
		 * get all necessary command-line-parameters here. remember to declare the argument in plugin manifest. for most purposes the settings file is sufficient
		 */

		File settingsXMLFile = new File(args[0]);

		if (settingsXMLFile.exists() && !settingsXMLFile.isDirectory()) {
			SettingsLoader sl = new SettingsLoader();
			Map<String, String> settings = sl.load(settingsXMLFile);
			Context.session().setSettings(settings);
		}

		/*
		 * 
		 * 
		 * following are some support services. these help in developing a plugin and are mostly independent of plugin implementation. this means any plugin can use these service.
		 */
		LogConfiguration.configure();

		LibraryLocator locator = new LibraryLocator(".", "./build");

		ArgumentFormatter formatter = new ObjectFormatter();

		/*
		 * 
		 * 
		 * Set up the communication channel. this could be one of many possible options. One may use shared-sqlite-db or tcp or some other exotic communication mechanism.
		 */
		CommunicationProtocol communicationProtocol = Context.session().getCommunicationProtocol();
		String communicationEndpoint = Context.session().getCommunicationEndpoint();

		TransportLayer transport = TransportChannelFactory.getTransport(communicationProtocol, communicationEndpoint);

		FunctionCallChannel fCallChannel = new FunctionCallChannel(transport);

		AsynchronousEventChannel eventChannel = new AsynchronousEventChannel(transport);

		/*
		 * Mandatory for setting a new channel for Encryption/Decryption purpose
		 */
		/*
		 *  earlier code
		 * DecryptionCallChannel dCallChannel = new DecryptionCallChannel(transport);
		 * Context.session().setDecryptionCallChannel(dCallChannel);
		 */
		CryptoCallChannel cryptoCallChannel = new CryptoCallChannel(transport);
		Context.session().setCryptoCallChannel(cryptoCallChannel);
		
		transport.open();

		/*
		 * 
		 * 
		 * these are exception handlers. add handlers specific to your application
		 */

		ArrayList<ExceptionHandler> exceptionHandlers = new ArrayList<ExceptionHandler>();

		exceptionHandlers.add(new ElementNotVisibleExceptionHandler());
		exceptionHandlers.add(new InvalidElementStateExceptionHandler());
		exceptionHandlers.add(new ObjectNotFoundExceptionHandler());
		exceptionHandlers.add(new UnexpectedTagNameExceptionHandler());
		exceptionHandlers.add(new UnhandledAlertExceptionHandler());
		exceptionHandlers.add(new UnknownServerExceptionHandler());

		exceptionHandlers.add(new NoSuchElementExceptionHandler());
		exceptionHandlers.add(new ToolNotSetExceptionHandler());
		// exceptionHandlers.add(new SessionNotFoundExceptionHandler());
		exceptionHandlers.add(new InvalidSelectorExceptionHandler());
		exceptionHandlers.add(new ElementNotExistInDropDownExceptionHandler());
		exceptionHandlers.add(new WebDriverExceptionHandler());
		exceptionHandlers.add(new StaleElementReferenceExceptionHandler());
		exceptionHandlers.add(new InvalidCoordinatesExceptionHandler());
		exceptionHandlers.add(new TimeoutExceptionHandler());

		ExceptionHandler[] arrOldExHandlers = exceptionHandlers.toArray(new ExceptionHandler[exceptionHandlers.size()]);

		ArrayList<ExceptionHandler2> listExceptionHandler2 = new ArrayList<ExceptionHandler2>();

		listExceptionHandler2.add(new SessionNotCreatedExceptionHandler());
		listExceptionHandler2.add(new NoSuchWindowExceptionHandler());
		listExceptionHandler2.add(new AppiumServerBusyExceptionHandler());
		listExceptionHandler2.add(new SelendroidServerNeverStartExceptionHandler());
		listExceptionHandler2.add(new AppiumCliValidationFailExceptionHandler());
		listExceptionHandler2.add(new UnreachableBrowserExceptionHandler());
		listExceptionHandler2.add(new UnsupportedCommandExceptionHandler());
		listExceptionHandler2.add(new AdbNotFoundExceptionHandler());

		/*
		 * 
		 * 
		 * set up the method dispatcher. user can provide their own dispatcher if the methods need to be called a bit differently
		 */
		File snapshotsDirectory = new File(Context.session().getScreenshotsDirectory());
		Dispatcher dispatcher = new AppiumDispatcher(locator, formatter, arrOldExHandlers, listExceptionHandler2, snapshotsDirectory);

		/*
		 * function loop reads and dispatches method one after one. this loop can be run in a separate thread.
		 */

		CloseableThread dispatchLoop = new CloseableThread(new FunctionDispatchLoop(fCallChannel, dispatcher, null));

		dispatchLoop.start();

		/*
		 * 
		 * 
		 * Subscribe to desired events. SESSION_ENDING event is a popular choice
		 * 
		 * you may even publish your own events, but that is quite rare
		 */

		EventHandler onTerminate = new AppiumTerminationHandler(dispatchLoop, fCallChannel, eventChannel, transport);
		eventChannel.subscribe(onTerminate);

		/*
		 * 
		 * 
		 * wait until the main loop dies out
		 */
		onTerminate.waitForNextEvent();
		logger.info("Good Bye...");
		
		/*
		 * 
		 * 
		 * Close plugin delibereately as some thread are running not know who 
		 */
		
		try {
		    System.out.println("closing plugin ");
		    System.exit(0);
		} catch (Exception e) {
		 System.out.println("exception while closing plugin "+e.getMessage());
		}
	}

}
