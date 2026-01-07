require 'timeout'

module OpKeyPluginBase
  
  class Dispatcher
    
    @exception_handlers = []
    
    def initialize
      @exception_handlers = Array.new      
    end # function
    
    def execute(methodName, args, timeoutInMillis)     
      comma_seperated_arg_list = args.join(',')

      invocation_string = "#{methodName}(#{comma_seperated_arg_list})"

      timeoutInSecs = (timeoutInMillis.to_f)/1000

      begin
        p = nil
        puts 'invoking : ' + invocation_string
        Timeout::timeout(timeoutInSecs) {p = eval invocation_string}
        return p

      rescue Timeout::Error => e
        return  generateErrorResult("The method #{methodName} timed out after #{timeoutInMillis}ms.")

      rescue ArgumentError => e
        return  generateErrorResult(ex_to_string(e))
          
      rescue NoMethodError => e
        # in course of action, somewhere some code invoked a method which does not exists.
        # we are interested in finding out whether the OpKey provided method didnt exist 
        # or whether the code inside the method was faulty (that it called a non-existing method)

        #TODO which method disnt exist?        
        return generateErrorResult("Method '#{methodName}' could not be located in any of the referenced libraries" + ex_to_string(ex) )        

      rescue Exception => e
        #check to see if the use has provided any handler for the exception
        @exception_handlers.each() do |handler|
          if handler.can_handle(e)
            return handler.handle(e)
          end
        end
        
        #if you have come this far then it is sure that no handler could handle it.
        #proceed as UnhandledException
        return  generateErrorResult(ex_to_string(e))

      end # block

    end # function
    
    
    def add_handler(handler)
      @exception_handlers.push(handler)
    end # function

    private # following section is private to the dispatcher

    #this method will produce the default responce in case of fault
    def generateErrorResult(message)
      res = FunctionResult.new()
      res.setMessage(message)
      res.setStatus('fail')
      return res
    end
    
    #this method generates a highly informative stack trace for an exception
    def ex_to_string(ex)
      info = "Exception --------> '" + ex.class.name + "' occured at:\n"
      info = info + ex.backtrace.join("\n")
      return info
    end

  end # class

end # module