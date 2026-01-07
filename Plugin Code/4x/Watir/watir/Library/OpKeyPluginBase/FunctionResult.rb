module OpKeyPluginBase
  
  class FunctionResult
    
    @_output = ""
    def getOutput
      return @_output
    end
    
    def setOutput(output)
      @_output = output
    end

    

    @_status = ""
    def getStatus
      return @_status
    end
    
    def setStatus(status)
      @_status = status
    end

    
    
        
    @_message
    def getMessage
      return @_message
    end
    
    def setMessage(message)
      @_message = message
    end
    
    
    def to_s
      p = "Output: #{@_output}\nStatus: #{@_status}\nMessage: #{@_message}"
    end
    
    
  end # class
    
end # module