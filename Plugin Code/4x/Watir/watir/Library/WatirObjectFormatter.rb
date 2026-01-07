class WatirObjectFormatter
  
  def generateObjectString(parentObject)
    pObj = parentObject
    
    # in current algorithm, we disregard the parent
    cObj = pObj.get_child_object()
    
    props = cObj.get_properties()

    matching_criteria = Array.new

    props.each do |prop|                 # loop through each property
      
      propname = prop.get_name           # name
      value = prop.get_value             # value
      is_regex = prop.get_isRegex.to_i   # is-regex

      if propname.include?(' ')
        #skip this property
        
      elsif is_regex == 1
        matching_criteria.push( ":#{propname} => /#{value}/" )
        
      else
        matching_criteria.push( ":#{propname} => '#{value}'" )
      end

    end # property

    objStr = '{' + matching_criteria.join(',') + '}'

    return objStr  #=> {:id => '2dy',:name => 'element1'}

  end # function

end # class