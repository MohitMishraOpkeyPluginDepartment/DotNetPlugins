module OpKeyPluginBase
     
  class FlatFileChannel

    @_file_Path
    def initialize (xmlFilePath)
      @_file_Path = xmlFilePath
    end #constructor

    #
    #gets command string for the function on the arbitary <@_file_Path> FilePath
    #
    def getMessageString()
      while 
        xmlStr = File.read(@_file_Path)
        puts xmlStr
        return xmlStr.to_s
      end     
      
    end
    
    #
    #Prints the Execution Result of a Particular Keyword
    #
    def send_Result (executionResult)         
         puts executionResult.to_s         
    end
   
  end #class FlatFileChannel
   
end #modulo