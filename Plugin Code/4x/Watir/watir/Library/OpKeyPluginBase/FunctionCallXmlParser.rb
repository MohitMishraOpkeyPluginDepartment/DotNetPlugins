require 'nokogiri'

module OpKeyPluginBase
  
  class FunctionCallXmlParser

    #http://ruby.bastardsbook.com/chapters/html-parsing/
    #http://www.w3schools.com/xpath/xpath_syntax.asp
    #
    
    def instantiateProperty(propNode)
      prop = OpKeyPluginBase::OrObjectProperty.new

      prop.set_name(propNode['name'])                       # name
      prop.set_value(propNode.inner_text)                   # value
      prop.set_isRegex(propNode['regularExpression'])       # is-regex

      return prop
    end #function
        
    def instantiateObject(pObjNode)
      pObj = OpKeyPluginBase::OrObject.new

      #fill the object's tag
      pObj.set_tag(pObjNode['tag'])                         # a special property of the object. passed in the object node itself

      #fill the object's properties
      propNodes = pObjNode.xpath('./Properties/Property')
      propNodes.each do |propNode|                          # there could be zero or more properties.
                                                            # but zero props is itself an error state 
        prop = instantiateProperty(propNode)

        pObj.get_properties().push(prop)                    # store the property in object's property list
      end # prop-nodes

      #fill the child object (if any exists)
      childObjectNodes = pObjNode.xpath('./ChildObject/Object')
      childObjectNodes.each do |cObjNode|                   # in strict two-level object hierarchy, we dont need this
        cObj = instantiateObject(cObjNode)                  # but in opkey nothing is STRICT. hence we go recursive

        pObj.set_child_object(cObj)
      end # child-object-nodes

      return pObj
    end # function
    
    
    def parse(xmlStr)      
      doc = Nokogiri::XML(xmlStr,nil,"UTF-8")
      
      #http://nokogiri.org/Nokogiri/XML/Document.html#method-i-remove_namespaces-21
      doc.remove_namespaces!     #we both dont understand and dont care of namespaces.

      fc = OpKeyPluginBase::FunctionCall.new

      fc.set_method_name(doc.xpath('//Function/@methodName').to_s)
     

      #
      #fetching data arguments
      #
      dataArgNodes = doc.xpath('//DataArgument')
      dataArgNodes.each do |dArgNode|
        dArg = OpKeyPluginBase::DataArgument.new

        dArg.set_arg_name(dArgNode['argumentName'])          #=> argument-name
        dArg.set_value(dArgNode.inner_text)                  #=> argument-value

        fc.get_data_arguments().push(dArg)                   # store this argument in the array
      end

      #
      #fetching object arguments
      #
      objArgNodes = doc.xpath('//ObjectArgument')
      objArgNodes.each do |oArgNode|                         # generlly there are one or zero object arguments
        oArg = OpKeyPluginBase::ObjectArgument.new

        oArg.set_argument_name(oArgNode['argumentName'])  #=> name of the object argument. most probably it will be 'object'
        #
        #fetching the parent object
        #
        parentObjNodes = oArgNode.xpath('//ObjectArgument/Object') #=> has to be just one and only one
        parentObjNodes.each do |pObjNode|

          pObj = instantiateObject(pObjNode)

          oArg.set_object(pObj)
        end #parent nodes

        fc.get_object_arguments().push(oArg)
      end # object arguments
      
      return fc
    end # function

  end # class

end # module