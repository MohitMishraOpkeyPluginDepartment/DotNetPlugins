require 'watir'

#$browser = Watir::Browser.attach(:title,//)

def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('') 
  return newTempMsg
end

def handleRider (aDB, cI, level, sA_ADB, sA_CI, sA_level, term_ADB, term_CI, term_level)
  
  propertyValues = Array.new
  sumAssuredValues = Array.new
  termValues = Array.new
  propval = 'propValues'
  _frameIndex = '5'
  _buttonName = 'Next'

if (aDB == 'Null' and cI == 'Null' and level == 'Null' and sA_ADB == 'Null' and sA_CI == 'Null' and sA_level == 'Null' and term_ADB == 'Null' and term_CI == 'Null' and term_level == 'Null')
	return generateResult('true','pass','step not executed')
end

  
  _riderCount = 0
  _CountForSaTerm = 0
  _incomeDrivenContribution = 0
  _aDBFlag = false
  _cIFlag = false  
  _levelFlag = false
  
  _aDBcontributionFlag = false
  _cIcontributionFlag = false
  _levelcontributionFlag = false
  _riderFormIsFilledFlag = false

  
  #/To calculate Total existing Riders on the PAGE/  
  if (aDB != 'Null')
    _riderCount = _riderCount +1
    _aDBFlag = true
  end
  if (cI != 'Null')
    _riderCount = _riderCount +1
    _cIFlag = true
  end
  if (level != 'Null')
    _riderCount = _riderCount +1
    _levelFlag = true
  end  
  
  
  begin
   if $browser.frame(:index => 5).text_field(:name => "propValues1").exists? then
	   _incomeDrivenContribution = 1
   else
	   _incomeDrivenContribution = 0
   end
   puts "_incomeDrivenContribution" + _incomeDrivenContribution.to_s
   rescue Exception => e
   puts e.to_s
   end

  for n in 0.._riderCount-1    
     _suffix = n + 1 + _incomeDrivenContribution
     #"{:name => " + "'" +  frameElement + "'" + "}"
     propertyValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")
     puts propertyValues[n]
  end  

  if (aDB == 'Yes')
    _CountForSaTerm = _CountForSaTerm +1
    _aDBcontributionFlag = true    
  end
  if (cI == 'Yes')
    _CountForSaTerm = _CountForSaTerm +1
    _cIcontributionFlag = true    
  end
  if (level == 'Yes')
    _CountForSaTerm = _CountForSaTerm +1
    _levelcontributionFlag = true    
  end
  
  for n in 0.._CountForSaTerm - 1
      _suffix = _suffix + 1
      sumAssuredValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")      
      puts sumAssuredValues[n]   
      _suffix = _suffix + 1
  end
  
  for n in 0.._CountForSaTerm - 1
      _suffix = _suffix + 1
      termValues.push("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")
      puts termValues[n]      
  end                 
  
  tempMessage = 'rc'+ _riderCount.to_s  
  
  begin
    
    if (_riderCount == 1 and _aDBFlag == true)
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select aDB
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown selected', aDB)
    end
    if (_riderCount == 1 and _cIFlag == true)
        tempMessage = prepareTempMessage(tempMessage, 'cI dropdown select starts')
        $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select cI
        tempMessage = prepareTempMessage(tempMessage, 'cI dropdown selected', cI)
    end
    
    if (_riderCount == 1 and _levelFlag == true)
       tempMessage = prepareTempMessage(tempMessage, 'level dropdown select starts')
       $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select level
       tempMessage = prepareTempMessage(tempMessage, 'level dropdown selected', level)
    end
    
    if (_riderCount == 2 and _aDBFlag == true and _cIFlag == true)
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select aDB
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown selected', aDB)
    
      tempMessage = prepareTempMessage(tempMessage, 'cI dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select cI
      tempMessage = prepareTempMessage(tempMessage, 'cI dropdown selected', cI)
    end
    
    if (_riderCount == 2 and _aDBFlag == true and _levelFlag == true)
     tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown select starts')
     $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select aDB
     tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown selected', aDB)
     
     tempMessage = prepareTempMessage(tempMessage, 'level dropdown select starts')
     $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select level
     tempMessage = prepareTempMessage(tempMessage, 'level dropdown selected', level)
   end

   if (_riderCount == 2 and _cIFlag == true and _levelFlag == true)
     tempMessage = prepareTempMessage(tempMessage, 'cI dropdown select starts')
     $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select cI
     tempMessage = prepareTempMessage(tempMessage, 'cI dropdown selected', cI)
     
     tempMessage = prepareTempMessage(tempMessage, 'level dropdown select starts')
     $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select level
     tempMessage = prepareTempMessage(tempMessage, 'level dropdown selected', level)
   end
    
   if (_riderCount == 3 and _aDBFlag == true and _cIFlag == true and _levelFlag == true)
     
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[0])).select aDB
      tempMessage = prepareTempMessage(tempMessage, 'aDB dropdown selected', aDB)
     
      tempMessage = prepareTempMessage(tempMessage, 'cI dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[1])).select cI
      tempMessage = prepareTempMessage(tempMessage, 'cI dropdown selected', cI)
      
      tempMessage = prepareTempMessage(tempMessage, 'level dropdown select starts')
      $browser.frame(:index, _frameIndex).select_list(eval(propertyValues[2])).select level
      tempMessage = prepareTempMessage(tempMessage, 'level dropdown selected', level)
    
   end
      
    #click next
     tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')          
     $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
     tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
     
     #^^^^^^^^^^^^^^^^^^^                    ^^^^^^^^^^^^^^^^^^^
     #^^^^^^^^^^^^^^^^^^^Sum Assured and Term^^^^^^^^^^^^^^^^^^^
     #^^^^^^^^^^^^^^^^^^^                    ^^^^^^^^^^^^^^^^^^^
                 
      if (_riderCount == 1 and (_aDBcontributionFlag == true))
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')                    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
	  _riderFormIsFilledFlag = true

      end
     
      if (_riderCount == 1 and (_cIcontributionFlag == true))
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')   
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')          
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')         
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')  
	  _riderFormIsFilledFlag = true      
      end
      
      if (_riderCount == 1 and (_levelcontributionFlag == true))
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')        
	  _riderFormIsFilledFlag = true
      end
    
      #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Starts
      
      if (_riderCount == 2 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
      
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')
	  _riderFormIsFilledFlag = true
                
      end
      
      if (_riderCount == 2 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == false))
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
	  _riderFormIsFilledFlag = true
                
      end
      
      if (_riderCount == 2 and (_aDBcontributionFlag == false) and (_cIcontributionFlag == true))      
           
         tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
         $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
         tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
         tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')
         $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
         tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')
	  _riderFormIsFilledFlag = true
                
      end
    
      if (_riderCount == 2 and (_aDBcontributionFlag == true) and (_levelcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
      
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')      
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
        
      end
      
      if (_riderCount == 2 and (_aDBcontributionFlag == true) and (_levelcontributionFlag == false))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
	  _riderFormIsFilledFlag = true
            
      end
      
      if (_riderCount == 2 and (_aDBcontributionFlag == false) and (_levelcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')      
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
        
      end
      
      if (_riderCount == 2 and (_cIcontributionFlag == true) and (_levelcontributionFlag == true))
       
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')
       
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
        
      end
      
      if (_riderCount == 2 and (_cIcontributionFlag == true) and (_levelcontributionFlag == false))
       
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')
	  _riderFormIsFilledFlag = true
        
      end
      
      if (_riderCount == 2 and (_cIcontributionFlag == false) and (_levelcontributionFlag == true))
       
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
        
      end
      #$$$$$$$$$$$$$$$$ RIDER COUNT == 2 $$$$$$$$$$$$$$$$ Ends
    
      #$$$$$$$$$$$$$$$$ RIDER COUNT == 3 $$$$$$$$$$$$$$$$ Starts
      if (_riderCount == 3 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == true) and (_levelcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')  
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')  
        
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')    
        
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[2])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[2])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true

              
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == true) and (_levelcontributionFlag == false))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')  
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')  
        
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')    
	  _riderFormIsFilledFlag = true
              
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == false) and (_levelcontributionFlag == true))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')  
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')  
          
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
              
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == false) and (_cIcontributionFlag == true) and (_levelcontributionFlag == true))
          
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')    
        
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[1])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[1])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
              
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == false) and (_cIcontributionFlag == true) and (_levelcontributionFlag == false))
        puts "enter in the false true false"
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_CI
          tempMessage = prepareTempMessage(tempMessage, 'cISumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'cITerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_CI
          tempMessage = prepareTempMessage(tempMessage, 'cITerm typed')    
          puts "done in the false true false"
	  _riderFormIsFilledFlag = true
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == false) and (_cIcontributionFlag == false) and (_levelcontributionFlag == true))
          
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_level
          tempMessage = prepareTempMessage(tempMessage, 'levelSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm type starts')    
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_level
          tempMessage = prepareTempMessage(tempMessage, 'levelTerm typed')
	  _riderFormIsFilledFlag = true
              
      end
      
      if (_riderCount == 3 and (_aDBcontributionFlag == true) and (_cIcontributionFlag == false) and (_levelcontributionFlag == false))
        
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured type starts')
          $browser.frame(:index, _frameIndex).text_field(eval(sumAssuredValues[0])).set sA_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBSumAssured typed')
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm type starts')  
          $browser.frame(:index, _frameIndex).text_field(eval(termValues[0])).set term_ADB
          tempMessage = prepareTempMessage(tempMessage, 'aDBTerm typed')
	  _riderFormIsFilledFlag = true
                
      end
      
    #$$$$$$$$$$$$$$$$ RIDER COUNT == 3 $$$$$$$$$$$$$$$$ Ends
      
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!&&&&&&&&&&&&!!!!!!!!!!!!!!!!!!!!!!!!!!!!!     

 	if (_riderFormIsFilledFlag == true) 
	#click next
     tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')          
     $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
     tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
	end

      
      return generateResult('true','pass',tempMessage)
      
   rescue Exception => e
        tempMessage = prepareTempMessage(tempMessage, e.to_s)
        puts  tempMessage 
        return generateResult('false','fail',tempMessage)      
   end

end # function

aDB = 'No'
cI = 'Yes'
level = 'No'
sA_ADB = 'Null'
sA_CI = '50000'
sA_level = 'Null'
term_ADB = 'Null'
term_CI = '5'
term_level = 'Null'

handleRider(aDB, cI, level, sA_ADB, sA_CI, sA_level, term_ADB, term_CI, term_level)
