module OpKeyPluginBase

  class FunctionCall
    
    # fields ---------------
    
    @_method_name
    
    @_object_arguments
      
    @_data_arguments
      
    # methods --------------
      
    def initialize()
      @_method_name = "-unknown-method-"
      @_object_arguments = Array.new()
      @_data_arguments = Array.new()
    end # constructor    
    
    
        
    def get_method_name
      return @_method_name
    end
    
    def set_method_name(methodname)
      @_method_name = methodname
    end
    
    
    
    
    def get_object_arguments
      return @_object_arguments
    end
    
    def set_object_arguments(objArgs)
      @_object_arguments = objArgs
    end
    
    
    
    def get_data_arguments
      return @_data_arguments 
    end
    
    def set_data_arguments(dataArgs)
      @_data_arguments = dataArgs
    end
    
  end # class
    
  
  class ObjectArgument
    
    @_argument_name
    
    @_object
    
    
    def initialize
      @_argument_name = '-unknown-argument-name-'
      @_object = OrObject.new
    end
    
    
    def get_argument_name
      return @_argument_name
    end
    
    def set_argument_name(argName)
      @_argument_name = argName
    end
    
    
    
    def get_object
      return @_object
    end
    
    def set_object(orObject)
      @_object = orObject
    end
    
  end # class
  
  
  class OrObject
    
    @_tag
    
    @_properties
    
    @_childObject
    
    def initialize
      @_tag = '-unknown-tag-'
      @_properties = Array.new
      @_childObject = nil
    end
    
    
    def get_tag
      return @_tag 
    end
    
    def set_tag(tag)
      @_tag = tag
    end
    
    
    
    def get_properties
      return @_properties
    end
    
    def set_properties(props)
      @_properties = props
    end
    
    
    
    def get_child_object
      return @_childObject
    end
    
    def set_child_object(cObj)
      @_childObject = cObj
    end
        
  end # class
  
  
  class OrObjectProperty
    
    @_name
    
    @_value
    
    @_isRegex
    
    
    def initialize
      @_name = "-unknown-prop-name-"
      @_value = "-unknown-value-"
      @_isRegex = '0' 
    end # constructor
    
    
    def get_name
      return @_name
    end # function
    
    def set_name(name)
      @_name = name
    end
    
    
    
    
    def get_value
      return @_value
    end
    
    def set_value(value)
      @_value = value
    end
    
    
    
    def get_isRegex
      return @_isRegex
    end
    
    def set_isRegex(isRegex)
      @_isRegex = isRegex
    end
    
  end # class

  
  class DataArgument
    
    @_argName
    
    @_value
    
    def initialize 
      @_argName = '-unknown-argument-'
      
      @_value = '-unknown-value-'
    end
    
    
    def get_arg_name
      return @_argName
    end
    
    def set_arg_name(name)
      @_argName = name
    end
    
    
    def get_value
      return @_value
    end
    
    def set_value(value)
      @_value = value
    end
    
  end
  
end # module