require '.\opkeypluginbase\functionresult'
require '.\opkeypluginbase\dispatcher'
require '.\opkeypluginbase\functioncall'
require '.\opkeypluginbase\flatfilechannel'
require '.\opkeypluginbase\xmlfunctioncallchannel'
require '.\opkeypluginbase\SHARED_DB_v1_Channel'
require 'win32ole'

require '.\internallib'
require '.\watirexceptionhandlers'
require '.\watirobjectformatter'



#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# COMMAND LINE ARGUMENTS via OpKey starts
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

_runtimelibpath =   ARGV[0]      # C:\Documents and Settings\mukul.chadha\Local Settings\Application Data\Crestech\Opkey
_currentUser =      ARGV[1]      # 'mukul.chadha' 
_executionTable =   ARGV[2]      # 'executionTab' 
_executionDbPath =  ARGV[3]      # "D:/SANDEEP/executiondb.db"  

#_runtimelibpath =   "C:/Users/xupretia/AppData/Local/Crestech/Opkey/RunTimeLibrary"
#_currentUser =      'xupretia'
#_executionTable =    'executionTab' 
#_executionDbPath =  'C:/Users/xupretia/AppData/Local/Crestech/Opkey/executiondb.db'


#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# COMMAND LINE ARGUMENTS via OpKey Ends
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
def puts(message)
  filepath = $_runtimelibpath_1.to_s + '/../watir-log.txt'
  File.open(filepath, 'a') {|f| f.puts('['.to_s + Time.now.to_s + ']'.to_s + ' ' + message) }
end 

$_runtimelibpath_1  = _runtimelibpath

File.open($_runtimelibpath.to_s + '/../watir-log.txt', 'w') {|f| f.puts('--------- EXECUTION STARTED -----------') }



puts 'current user ' + _currentUser
puts 'runtime lib path ' + _runtimelibpath
puts 'execution table name ' + _executionTable
puts 'execution db path ' + _executionDbPath






_timeout =  300000

#require all Libraries at the _runtimelibpath BEGINS
my_dir = Dir["#{_runtimelibpath}*.rb"]   # collect all the 
     compare = _runtimelibpath + "asdf.rb" 
     my_dir.each do |filename|
        if not filename == compare then
          puts filename
          require filename
        end        
end


#begin
#  my_dir = Dir["#{_runtimelibpath}/*.rb"]   # collect all the 
#      my_dir.each do |filename|
#        require filename
#   end
#end

#require all Libraries at the _runtimelibpath ENDS



#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#Declaration of variables and reference STARTS
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
puts 'declaration of variables and references'

dispatcher = OpKeyPluginBase::Dispatcher.new
dispatcher.add_handler(WatirExceptionHandlers::UnknownObjectExceptionHandler.new)

formatter = WatirObjectFormatter.new

#transportLayer = OpKeyPluginBase::FlatFileChannel.new("D:/SANDEEP/browserOpen_sample.xml")
transportLayer = OpKeyPluginBase::SHARED_DB_v1_Channel.new(_executionDbPath, _currentUser,_executionTable)
#messageLayer = OpKeyPluginBase::Hard_Coded_Values_Channel.new("Method_typeTextOnEditBox1", {:micclass => 'Link',:text => 'Bengali'}, ['data1','data2'])
messageLayer = OpKeyPluginBase::XmlFunctionCallChannel.new(transportLayer)

#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#Declaration of variables and reference ENDS
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


def CountDownPopUp
	puts "checking for CountDown PopUp"	
	au3 = WIN32OLE.new("AutoItX3.Control") 
		begin
			puts "enterdCountDownBegin"	
			puts "enterdCountDownBegin"	
			if (au3.WinExists("[REGEXPTITLE:\ountDown\]") == 1)
				puts "found CountDown PopUp"
				au3.WinActivate("[REGEXPTITLE:\ountDown\]")
				puts "activated CountDown PopUp"
				au3.Send("!{F4}" )  		
				puts "send ENTER on CountDown PopUp"
			end
		rescue Exception => e
			puts e.to_s
		end
	ObjectSpace.each_object(WIN32OLE).to_a
	ObjectSpace.garbage_collect
end


  puts "entering dispatch loop"
  count = 0
  while true
	  
	puts 'starts batch'
	system("\"#{_runtimelibpath}heuristic/PreventLockIn.bat\" \"#{_runtimelibpath}heuristic\"")   
	puts "start batch"	
	#puts "\"#{_runtimelibpath}heuristic\PreventLockIn.bat\" \"#{_runtimelibpath}\""
	puts "\"#{_runtimelibpath}heuristic/PreventLockIn.bat\" \"#{_runtimelibpath}heuristic\""
	puts 'ends batch'
    puts 'waiting for next message'
    fc = messageLayer.next_message()
    
    if fc == nil
      #code never comes here. this is a just a safety check
      sleep 0.1
      next
    end
      
    puts "method name: " + fc.get_method_name().to_s
    
    objStr = nil
    if fc.get_object_arguments.length > 0 
      puts 'generating object string...'
      objStr = formatter.generateObjectString(fc.get_object_arguments()[0].get_object)
      puts objStr
    end
        
    puts 'generating argument array...' 
    args = Array.new()
    objStr != nil ? args.push(objStr) : 1
    
    fc.get_data_arguments().each do |dArg|
      puts dArg.get_value
      args.push("'" + dArg.get_value + "'")
    end
    
    if fc.get_method_name().to_s != 'Method_wait' and fc.get_method_name().to_s != 'Method_selectParentWindow' and fc.get_method_name().to_s !='Method_selectWindow'then
   CountDownPopUp()
   end
   
    p = dispatcher.execute(fc.get_method_name(), args, _timeout)    
    
    puts 'command executed. result: ' + p.getStatus     
    messageLayer.send_result(p)
  end
  
  
  
  
  
  

#args = ["'internet explorer'", "'file://C:/Users/Scorpion/Desktop/sand_site.html'"]
#p = dispatcher.execute("Method_WebBrowserOpen", args, 30000)
#puts p.to_s()


#puts p.to_s()