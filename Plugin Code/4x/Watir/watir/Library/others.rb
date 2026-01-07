require 'watir'

#$browser = Watir::Browser.attach(:title,//)

def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('') 
  return newTempMsg
end

def handleAdvisorConfidential (assured, la, otherRisk, assured_Remark, la_Remark, otherRisk_Remark)
  
  propertyValues = Array.new
  furtherDetailsValues = Array.new
  termValues = Array.new
  propval = 'propValues'
  _frameIndex = '5'
  _suffix = 2
  _buttonName = 'Next'
  
if (assured == 'Null' and la == 'Null' and otherRisk == 'Null' and assured_Remark == 'Null' and la_Remark == 'Null' and otherRisk_Remark == 'Null')
	return generateResult('true','pass','step not executed')
end

  
  _consumptionCount = 0
  _CountForFurtherDetails = 0
  _assuredFlag = false
  _laFlag = false  
  _otherRiskFlag = false
  
  _assuredcontributionFlag = false
  _lacontributionFlag = false
  _otherRiskcontributionFlag = false
  __consumptionFormIsFilledFlag = false

  
  #/To calculate Total existing Riders on the PAGE/  
  if (assured != 'Null')
    _consumptionCount = _consumptionCount +1
    _assuredFlag = true
  end
  if (la != 'Null')
    _consumptionCount = _consumptionCount +1
    _laFlag = true
  end
  if (otherRisk != 'Null')
    _consumptionCount = _consumptionCount +1
    _otherRiskFlag = true
  end  
  
  
  begin
  
    for n in 0.._consumptionCount-1    
     _suffix = _suffix + 1
     #"{:name => " + "'" +  frameElement + "'" + "}"
     propertyValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")
     puts propertyValues[n]
  end  

  if (assured == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _assuredcontributionFlag = true    
  end
  if (la == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _lacontributionFlag = true    
  end
  if (otherRisk == 'Yes')
    _CountForFurtherDetails = _CountForFurtherDetails +1
    _otherRiskcontributionFlag = true    
  end
  
  for n in 0.._CountForFurtherDetails - 1
      _suffix = _suffix + 1
      furtherDetailsValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")      
      puts furtherDetailsValues[n]   
  end
  
  tempMessage = 'consumption'+ _consumptionCount.to_s  
  
  begin
    
   if (_consumptionCount == 3 and _assuredFlag == true and _laFlag == true and _otherRiskFlag == true)
     
      tempMessage = prepareTempMessage(tempMessage, 'assured dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select assured
      tempMessage = prepareTempMessage(tempMessage, 'assured dropdown selected', assured)
     
      tempMessage = prepareTempMessage(tempMessage, 'la starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select la
      tempMessage = prepareTempMessage(tempMessage, 'la selected', la)
      
      tempMessage = prepareTempMessage(tempMessage, 'otherRisk starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[2])).select otherRisk
      tempMessage = prepareTempMessage(tempMessage, 'otherRisk selected', otherRisk)
    
     tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')          
	  $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
         tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
          Method_wait(3)
    
    
   end
      
      if (_CountForFurtherDetails == 1 and (_assuredcontributionFlag == true))
	  
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select assured_Remark
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs selected')
       
      end
     
      if (_CountForFurtherDetails == 1 and (_lacontributionFlag == true))
               
          tempMessage = prepareTempMessage(tempMessage, 'la starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[0])).set la_Remark
          tempMessage = prepareTempMessage(tempMessage, 'la typed')
  
      end
      
      if (_CountForFurtherDetails == 1 and (_otherRiskcontributionFlag == true))
	  tempMessage = prepareTempMessage(tempMessage, 'otherRisk  starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[0])).set otherRisk_Remark
          tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed')          
          
      end
    
      #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Starts
      
      if (_CountForFurtherDetails == 2 and (_assuredcontributionFlag == true) and (_lacontributionFlag == true))
        
  
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select assured_Remark
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs selected')
  
            tempMessage = prepareTempMessage(tempMessage, 'latype starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set la_Remark
          tempMessage = prepareTempMessage(tempMessage, 'lap typed')
                
      end
      
      if (_CountForFurtherDetails == 2 and (_assuredcontributionFlag == true) and (_otherRiskcontributionFlag == true))
	      
          
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select assured_Remark
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs selected')
	  
	  tempMessage = prepareTempMessage(tempMessage, 'otherRisk starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set otherRisk_Remark
          tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed') 
                
      end
      
      if (_CountForFurtherDetails == 2 and (_otherRiskcontributionFlag == true) and (_lacontributionFlag == true))      
                         
             tempMessage = prepareTempMessage(tempMessage, 'la starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[0])).set la_Remark
          tempMessage = prepareTempMessage(tempMessage, 'la typed')

            tempMessage = prepareTempMessage(tempMessage, 'otherRisk starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set otherRisk_Remark
          tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed') 
   
      end
    
      #~ #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Ends
    
      #~ #$$$$$$$$$$$$$$$$ RIDER COUNT == 3 $$$$$$$$$$$$$$$$ Starts
      if (_CountForFurtherDetails == 3 and (_assuredcontributionFlag == true) and (_lacontributionFlag == true) and (_otherRiskcontributionFlag == true))
	      
	    
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs select starts')
          $browser.frame(:index, _frameIndex).select_list(eval(furtherDetailsValues[0])).select assured_Remark
          tempMessage = prepareTempMessage(tempMessage, 'assuredAs selected')
	  
	    tempMessage = prepareTempMessage(tempMessage, 'la starts')         
	  $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[1])).set la_Remark
          tempMessage = prepareTempMessage(tempMessage, 'la typed')
	  
	tempMessage = prepareTempMessage(tempMessage, 'otherRisk starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(furtherDetailsValues[2])).set otherRisk_Remark
          tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed') 

              
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

#~ assured = 'No'
#~ la = 'No'
#~ otherRisk = 'No'

#~ assured_Remark = 'No'
#~ la_Remark = 'No'
#~ otherRisk_Remark = 'No'

#~ a_AS = 'No'
#~ a_perDay = 'No'
#~ a_perWeek = 'No'

#~ n_AS = 'No'
#~ n_perDay = 'No'
#~ n_perWeek = 'No'

#~ handleConsumption(assured, la, otherRisk, assured_Remark, la_Remark, otherRisk_Remark, a_AS, a_perDay, a_perWeek, n_AS, n_perDay, n_perWeek)
