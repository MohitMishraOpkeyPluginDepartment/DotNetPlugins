module WatirExceptionHandlers
  
  class UnknownObjectExceptionHandler
    
    def can_handle(ex)
      if ex.class.name == 'Watir::Exception::UnknownObjectException'
        return true
      end
    end
    
    def handle(ex)
      return generateResult('','Fail','Object not found with specified properties')
    end
    
  end #class
    
  
  
  def generateResult(output, status, message)
    res = RubyPluginBase::FunctionResult.new
    res.setOutput(output)
    res.setStatus(status)
    res.setMessage(message)
  
    return res
  
  end # function
    
end # module