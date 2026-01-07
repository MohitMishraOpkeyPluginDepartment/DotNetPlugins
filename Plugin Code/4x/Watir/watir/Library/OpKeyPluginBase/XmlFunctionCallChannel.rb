require '.\opkeypluginbase\FunctionCallXmlParser'

module OpKeyPluginBase

class XmlFunctionCallChannel

   @_oTransportLayer
   @_xmlParser
   
   def initialize(objTransportLayer)
     puts 'initializing function call channel with :' + objTransportLayer.to_s
     @_oTransportLayer = objTransportLayer
     @_xmlParser = OpKeyPluginBase::FunctionCallXmlParser.new
   end

   def next_message()
     
     xmlStrs = @_oTransportLayer.getMessageString()
     
     functionCall = @_xmlParser.parse(xmlStrs)
     puts 'parsed message'
          
     return functionCall

   rescue Exception => e
        puts e.to_s
        return nil
   end # function

   
   def send_result (executionResult)
     
     puts "result send from xmlFunctionCallChannel"
     
     @_oTransportLayer.send_Result(executionResult)
     
   end

 end #class XmlFunctionCallChannel
 
end
