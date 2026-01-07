require "win32ole"
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
# COMMAND LINE ARGUMENTS via OpKey starts
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
_runtimelibpath =   ARGV[0]      # C:\Documents and Settings\mukul.chadha\Local Settings\Application Data\Crestech\Opkey
_currentUser =      ARGV[1]      # 'mukul.chadha' 
_executionTable =   ARGV[2]      # 'executionTab' 
_executionDbPath =  ARGV[3]      # "D:/SANDEEP/executiondb.db"  



#_runtimelibpath =   'C:/Users/xupretia/AppData/Local/Crestech/Opkey'
#_currentUser =      'xupretia'
#_executionTable =    'executionTab' 
#_executionDbPath =  'D:/SANDEEP/executiondb.db'

def puts(message)
  filepath = $_runtimelibpath_1.to_s + '/../watir-log.txt'
  File.open(filepath, 'a') {|f| f.puts('['.to_s + Time.now.to_s + ']'.to_s + ' ' + message) }
end 

$_runtimelibpath_1  = _runtimelibpath

File.open($_runtimelibpath.to_s + '/../watir-log.txt', 'w') {|f| f.puts('--------- EXECUTION STARTED -----------') }

		Dir.chdir _runtimelibpath				
		require './asdf'



