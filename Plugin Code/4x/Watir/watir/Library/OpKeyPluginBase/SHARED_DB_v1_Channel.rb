require 'sqlite3'

module OpKeyPluginBase
  class SHARED_DB_v1_Channel

    @_currentuser
    @_table
    @_executionDbPath
    def initialize(executionDbPath, currentuser, _table)
      @_executionDbPath = executionDbPath
      @_currentuser = currentuser
      @_table = _table
    end

    #
    #gets command string for the keyword on the arbitary <@_dataBase_Path> DBPath
    #
    def getMessageString()
      
      commandString = "no value fetched"

      begin
        
	puts "@_executionDbPath #{@_executionDbPath}"
	db = SQLite3::Database.new @_executionDbPath
        rowCount = 0
	
        while rowCount == 0	 
          table = db.execute "select count(*) from  #{@_table} WHERE username = '#{@_currentuser}' and OpkeyFlag = '1' and PluginFlag = '0'"
          rowCount = table[0][0] # contains count(*)
          
          sleep 0.1 if rowCount == 0
          puts "fetching xml"
        end
          puts "FETCHED SUCCESSFULLY"

        query = "SELECT CommandString FROM #{@_table} WHERE username = '#{@_currentuser}' and OpkeyFlag = '1' and PluginFlag = '0'"
        rows = db.execute query
                
        commandString = "#{rows [0][0]}"
        
        puts "Obtained command : #{commandString}"
        
        #puts (rows.join "\s")
        
      rescue SQLite3::Exception => e

        puts "Exception occured while fetching the commandString from executionDb"
        puts e.to_s        
      ensure
        
        db.close if db
      end
      
      return  commandString
    end

    #
    #Prints the Execution Result of a Particular Keyword
    #
   
   def send_Result(executionResult)
      puts 'entering send_result'
      opvar = executionResult.getOutput()
      status = executionResult.getStatus()
      message = executionResult.getMessage()
      @_exponentTime
      
      puts 'before entering while'
      while true
        puts 'in while'
        
        db = SQLite3::Database.new @_executionDbPath
          begin
            puts 'enetring begin'
		message = message.gsub("'","\"")
            query = "UPDATE #{@_table}  SET Opvar= '#{opvar}' , Status = '#{status}' , Message= '#{message}' , OpkeyFlag='0' , CommandString='' , WantSnapShot='' , StepTimeOut='' where username = '#{@_currentuser}'"
            puts query
	    db.execute(query);
    
            query = "UPDATE #{@_table} SET PluginFlag='1'  where username= '#{@_currentuser}'"
            db.execute(query);
            @_exponentTime = 1 #//reset the time to 1         
            break
            
          rescue SQLite3::BusyException => e
            puts "Busy-Exception"
                       
          rescue SQLite3::Exception => e
            puts "Exception occured while updating the result to executionDB and exception details are"
            puts e.to_s
            @_exponentTime = @_exponentTime + 1
            sleep @_exponentTime
            puts "@_sleepTime" + @_exponentTime.to_s 
                
          ensure
            puts 'in ensure'
            db.close if db
          end #Begin
        
          puts 'after begin block end'
      end #While
      
      puts 'ending function'
    end #Function
    
  end #Class

end #Module