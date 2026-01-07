require 'watir'

#$browser = Watir::Browser.attach(:title,//)

def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('') 
  return newTempMsg
end

def handleConsumption (tbco, alohl, nrcotic, t_AS, t_perDay, t_perWeek, a_AS, a_perDay, a_perWeek, n_AS, n_perDay, n_perWeek)
  
  propertyValues = Array.new
  furtherDetailsValues = Array.new
  termValues = Array.new
  propval = 'propValues'
  _frameIndex = '5'
  _suffix = 3
  _buttonName = 'Next'

if (tbco == 'Null' and alohl == 'Null' and nrcotic == 'Null' and t_AS == 'Null' and t_perDay == 'Null' and t_perWeek == 'Null' and a_AS == 'Null' and a_perDay == 'Null' and a_perWeek == 'Null' and n_AS == 'Null' and n_perDay == 'Null' and n_perWeek == 'Null')
	return generateResult('true','pass','step not executed')
end

  
  _consumptionCount = 0
  _CountForFurtherDetails = 0
  _tbcoFlag = false
  _alohlFlag = false  
  _nrcoticFlag = false
  
  _tbcocontributionFlag = false
  _alohlcontributionFlag = false
  _nrcoticcontributionFlag = false
  __consumptionFormIsFilledFlag = false

  
  #/To calculate Total existing Riders on the PAGE/  
  if (tbco != 'Null')
    _consumptionCount = _consumptionCount +1
    _tbcoFlag = true
  end
  if (alohl != 'Null')
    _consumptionCount = _consumptionCount +1
    _alohlFlag = true
  end
  if (nrcotic != 'Null')
    _consumptionCount = _consumptionCount +1
    _nrcoticFlag = true
  end  
  
  
  begin
  
    for n in 0.._consumptionCount-1    
     _suffix = _suffix + 1
     #"{:name => " + "'" +  frameElement + "'" + "}"
     propertyValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")
     puts propertyValues[n]
  end  

  if (tbco == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _tbcocontributionFlag = true    
  end
  if (alohl == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _alohlcontributionFlag = true    
  end
  if (nrcotic == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _nrcoticcontributionFlag = true    
  end
  
  for n in 0.._CountForFurtherDetails - 1
      _suffix = _suffix + 1
      furtherDetailsValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")      
      puts furtherDetailsValues[n]   
      _suffix = _suffix + 1
      furtherDetailsValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")      
      puts furtherDetailsValues[n+1]   
      _suffix = _suffix + 1
      furtherDetailsValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")      
      puts furtherDetailsValues[n+2]  
  end
  
  tempMessage = 'consumption'+ _consumptionCount.to_s  
  
  begin
    
   if (_consumptionCount == 3 and _tbcoFlag == true and _alohlFlag == true and _nrcoticFlag == true)
     
      tempMessage = prepareTempMessage(tempMessage, 'tbco dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select tbco
      tempMessage = prepareTempMessage(tempMessage, 'tbco dropdown selected', tbco)
     
      tempMessage = prepareTempMessage(tempMessage, 'alohl dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select alohl
      tempMessage = prepareTempMessage(tempMessage, 'alohl dropdown selected', alohl)
      
      tempMessage = prepareTempMessage(tempMessage, 'nrcotic dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[2])).select nrcotic
      tempMessage = prepareTempMessage(tempMessage, 'nrcotic dropdown selected', nrcotic)
      
       tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')          
	  $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
         tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
          Method_wait(3)
    
   end
      
      if (_CountForFurtherDetails == 1 and (_tbcocontributionFlag == true))
	  
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select t_AS
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs selected')
          tempMessage = prepareTempMessage(tempMessage, 'tbcoPerDay type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set t_perDay
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'tbcoweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set t_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperWeek typed')
	  __consumptionFormIsFilledFlag = true

      end
     
      if (_CountForFurtherDetails == 1 and (_alohlcontributionFlag == true))
          tempMessage = prepareTempMessage(tempMessage, 'alohlAs select starts')   
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select a_AS
          tempMessage = prepareTempMessage(tempMessage, 'alohlAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'alohlperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set a_perDay
          tempMessage = prepareTempMessage(tempMessage, 'alohlperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'alohlweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set a_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'alohlperWeek typed')
	  __consumptionFormIsFilledFlag = true      
      end
      
      if (_CountForFurtherDetails == 1 and (_nrcoticcontributionFlag == true))
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs select starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[0])).set n_AS
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set n_perDay
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set n_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperWeek typed')      
	  __consumptionFormIsFilledFlag = true
      end
    
      #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Starts
      
      if (_CountForFurtherDetails == 2 and (_tbcocontributionFlag == true) and (_alohlcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select t_AS
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs selected')
          tempMessage = prepareTempMessage(tempMessage, 'tbcoPerDay type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set t_perDay
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'tbcoweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set t_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperWeek typed')
      
	  tempMessage = prepareTempMessage(tempMessage, 'alohlAs select starts')   
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[3])).select a_AS
          tempMessage = prepareTempMessage(tempMessage, 'alohlAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'alohlperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[4])).set a_perDay
          tempMessage = prepareTempMessage(tempMessage, 'alohlperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'alohlweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[5])).set a_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'alohlperWeek typed')
	  __consumptionFormIsFilledFlag = true
                
      end
      
      if (_CountForFurtherDetails == 2 and (_tbcocontributionFlag == true) and (_nrcoticcontributionFlag == true))
	      
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select t_AS
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs selected')
          tempMessage = prepareTempMessage(tempMessage, 'tbcoPerDay type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set t_perDay
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'tbcoweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set t_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperWeek typed')
	  
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs select starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[3])).set n_AS
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[4])).set n_perDay
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[5])).set n_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperWeek typed') 
	  __consumptionFormIsFilledFlag = true
                
      end
      
      if (_CountForFurtherDetails == 2 and (_nrcoticcontributionFlag == true) and (_alohlcontributionFlag == true))      
          

           
	  tempMessage = prepareTempMessage(tempMessage, 'alohlAs select starts')   
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select a_AS
          tempMessage = prepareTempMessage(tempMessage, 'alohlAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'alohlperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set a_perDay
          tempMessage = prepareTempMessage(tempMessage, 'alohlperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'alohlweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set a_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'alohlperWeek typed')
	  
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs select starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[3])).set n_AS
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[4])).set n_perDay
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[5])).set n_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperWeek typed') 
	  
	  
	  __consumptionFormIsFilledFlag = true
                
      end
    
      #~ #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Ends
    
      #~ #$$$$$$$$$$$$$$$$ RIDER COUNT == 3 $$$$$$$$$$$$$$$$ Starts
      if (_CountForFurtherDetails == 3 and (_tbcocontributionFlag == true) and (_alohlcontributionFlag == true) and (_nrcoticcontributionFlag == true))
	      
	      tempMessage = prepareTempMessage(tempMessage, 'tbcoAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select t_AS
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'tbcoAs selected')
          tempMessage = prepareTempMessage(tempMessage, 'tbcoPerDay type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set t_perDay
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'tbcoweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set t_perWeek
          tempMessage = prepareTempMessage(tempMessage, 'tbcoperWeek typed')
         
	 
	  tempMessage = prepareTempMessage(tempMessage, 'alohlAs select starts')   
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[3])).select a_AS
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'alohlAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'alohlperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[4])).set a_perDay
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'alohlperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'alohlweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[5])).set a_perWeek
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'alohlperWeek typed')
	  
            tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs select starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[6])).set n_AS
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticAs selected')          
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperDay type starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[7])).set n_perDay
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperday typed')
	  tempMessage = prepareTempMessage(tempMessage, 'nrcoticweek type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[8])).set n_perWeek
	  Method_wait(1)
          tempMessage = prepareTempMessage(tempMessage, 'nrcoticperWeek typed')
	  __consumptionFormIsFilledFlag = true

              
      end
      
      
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!&&&&&&&&&&&&!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     

 	#~ if (__consumptionFormIsFilledFlag == true) 
	#~ #click next
     #~ tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')          
     #~ $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
     #~ tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
	#~ end

      
      return generateResult('true','pass',tempMessage)
      
   rescue Exception => e
        tempMessage = prepareTempMessage(tempMessage, e.to_s)
	puts 'myerror'
        puts  tempMessage 
        return generateResult('false','fail',tempMessage)      
   end

end # function
end

#~ tbco = 'No'
#~ alohl = 'No'
#~ nrcotic = 'No'

#~ t_AS = 'No'
#~ t_perDay = 'No'
#~ t_perWeek = 'No'

#~ a_AS = 'No'
#~ a_perDay = 'No'
#~ a_perWeek = 'No'

#~ n_AS = 'No'
#~ n_perDay = 'No'
#~ n_perWeek = 'No'

#~ handleConsumption(tbco, alohl, nrcotic, t_AS, t_perDay, t_perWeek, a_AS, a_perDay, a_perWeek, n_AS, n_perDay, n_perWeek)
