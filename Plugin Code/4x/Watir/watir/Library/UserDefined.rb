require "win32ole"
def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('')
  return newTempMsg
end


#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#         USER DEFINED KEYWORDS
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#================================================

#================================================
#Note:: By Default
#	_browsrTitl = 'TCS B'
#	_browserText = ''
#	_refreshPosition = 18
def Method_RefreshLeftMenu(_browsrTitl,_refreshPosition)	
	path = "C:\\Program Files\\CresTech\\Opkey\\Assembly\\CONFIG\\Tools\\Plugins\\watir\\Library\\heuristic\\RefreshLeftMenu.exe"
	puts ("#{path}")
	_browserText = ''
	
	puts "\"#{path}\" #{_browsrTitl},#{_browserText},#{_refreshPosition}"
	output = system("\"#{path}\" #{_browsrTitl},#{_browserText},#{_refreshPosition}")
	return generateResult('true','pass','Refresh Left Menu')
end

#================================================
def Method_selectParentWindow()
  $browser = Watir::Browser.attach(:title,//)
  return generateResult('true','pass',"Parent window is selected")
end
#================================================
def Method_linkClick(property)
 
  aa2d  = Hash.new
  linkStr = ""
  franeStr = ""
 
  #Sample:: property {:div => 'id-223',:frame => 'frameName'}
  property = property.to_s
  puts property
  begin
    

    property = property.gsub("link","class")
     puts "1"+ property.to_s
    property = property.gsub("frame","index")
     puts property

    propArray = property.split(",")
    if propArray[1].include?"class" then
      frameStr =  propArray[0] + '}'
      linkStr = '{' + propArray[1]
      puts "if"
    
    else
    linkStr =  propArray[0] + '}'
    frameStr = '{' + propArray[1]
      puts "else"    
    end
#divStr = divStr.to_s
#frameStr = frameStr.to_s
    
linkStr = linkStr.gsub(" ","")
linkStr = linkStr.gsub("\"","'")
   # divStr = divStr.gsub("=>",", ")
    frameStr = frameStr.gsub(" ","")
   frameStr = frameStr.gsub("\"","'")    
    #frameStr = frameStr.gsub("=>",", ")
    puts "=========="
    puts linkStr
    puts "=========="
    puts frameStr

#   frameStr = frameStr.gsub("{","(")
#   frameStr = frameStr.gsub("}",")") 
#    divStr = divStr.gsub("{","(")
#    divStr = divStr.gsub("}",")")
   

    $browser.frame(eval(frameStr)).link(eval(linkStr)).click

    generateResult('true', "Pass", "clicked")

  rescue Exception => e
    generateResult('false', "Fail", e.to_s)
  end
end
#================================================
#gettextfromtextbox____get PolicyNumber
def Method_getTextfromtextbox(object)
  objectHash =  method_HandleFrameObjects(object)
  data = "no data found"
  case objectHash.length
  when 2
   data = $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).text
    
  when 1
   data = $browser.text_field(eval(objectHash[0])).text    
  end
  if data == ""
	  data = 'Null'
  end
   return generateResult( data,'pass','item is selected')
end
#================================================
#gettextfromtable _error code from Error handler pop up
def Method_getTextfromPopup() 
   $browser.table(:index=>0).cells[1].flash
   data = $browser.table(:index=>0).cells[1].text
   return generateResult( data,'pass','item is selected')   
end
#================================================
def Method_linkClickByName(input)  
  $browser.frame(:index, 5).link(:name => "firstFocus", :index => input).flash
  sleep (1)
  $browser.frame(:index, 5).link(:name => "firstFocus", :index => input).click  
  return generateResult('true','pass',"Parent window is selected")
end
#================================================
#checks for the existense of an button
def Method_isSessionTerminated(object)
  objectHash =  method_HandleFrameObjects(object)  
  flag = 0
 
 case objectHash.length
   when 2
   puts "frame"
   if $browser.frame(eval(objectHash[0])).button(eval(objectHash[1])).exists? then
     flag = 1          
    end     
   when 1
   puts "no frame"
   if $browser.button(eval(objectHash[0])).exists? then
     flag = 1          
   end
 end  
 
 if  (flag == 1) then
    return generateResult('true','pass','session is terminated')
 else
    return generateResult('false','pass','session is not terminated') 
 end
end


#click on button (FundTransfer)
def Method_clickButtonOnPopUp()
	/puts "Entering the function and about to click"
	$browser.button(:name => "CloseWin").focus
	
    $browser.button(:name => "CloseWin").click    
    puts "clicked onPopUp"/
    au3 = WIN32OLE.new("AutoItX3.Control")
    
if (au3.WinExists("[REGEXPTITLE:\Window - \]") == 0)
	 return generateResult('true','pass',"step not executed ,window not exists")
end
    
    
	timeInSec = 4

tempMsg = 'starts by method One'
	#Handle by AUTO IT
  
  au3.WinActivate("[REGEXPTITLE:\Window - \]")
  puts "popup.1"
  tempMsg = prepareTempMessage(tempMsg,'before alt F4')
 
  
  if (au3.WinExists("[REGEXPTITLE:\Window - \]") == 1)
	   puts "popup.2"
	au3.Send("!{F4}" )   
	tempMsg = prepareTempMessage(tempMsg,'after alt F4')
end
	
puts "popup.3"
  sleep timeInSec.to_f   
puts "popup.4"  
    tempMsg = prepareTempMessage(tempMsg,'clicked on button')
    puts "popup.5"
    return generateResult('true','pass',tempMsg)
  end
#================================================
def Method_leftMenuClick(property)
 
  aa2d  = Hash.new
  divStr = ""
  franeStr = ""
 
  #Sample:: property {:div => 'id-223',:frame => 'frameName'}
  property = property.to_s
  puts property
  begin
    
    property = property.gsub("div","id")
     puts "1"+ property.to_s
    property = property.gsub("frame","name")
     puts property

    propArray = property.split(",")
    if propArray[1].include?"id" then
      frameStr =  propArray[0] + '}'
      divStr = '{' + propArray[1]
      puts "if"
    
    else
    divStr =  propArray[0] + '}'
    frameStr = '{' + propArray[1]
      puts "else"    
    end
#divStr = divStr.to_s
#frameStr = frameStr.to_s
    
    divStr = divStr.gsub(" ","")
   divStr = divStr.gsub("\"","'")
   # divStr = divStr.gsub("=>",", ")
    frameStr = frameStr.gsub(" ","")
   frameStr = frameStr.gsub("\"","'")    
    #frameStr = frameStr.gsub("=>",", ")
    puts "=========="
    puts divStr
    puts "=========="
    puts frameStr

#   frameStr = frameStr.gsub("{","(")
#   frameStr = frameStr.gsub("}",")") 
#    divStr = divStr.gsub("{","(")
#    divStr = divStr.gsub("}",")")
   

    $browser.frame(eval(frameStr)).div(eval(divStr)).click

    generateResult('true', "Pass", "left Menu is clicked")

  rescue Exception => e
    generateResult('false', "Fail", e.to_s)
  end
end


#================================================
def click(input)  
	if(input.casecmp("nuLL")== 0)
          return generateResult('true','pass','step not executed')
  end  
	
  case input
  when "Policy"
    idex = 0
  when "Attribute"
    idex = 1
  when "Relations"
    idex = 2
  when "Life Assured"
    idex = 3
  when "Document"
    idex = 4
  when "Followup"
    idex = 5
  when "Payments"
    idex = 6
  when "Loan"
    idex = 7
  when "Notes"
    idex = 8
  end      
        
  $browser.frame(:name, "display").table(:class=> "tableStyle", :index=>0).cells[idex].links[0].flash
  sleep(2)
  $browser.frame(:name, "display").table(:class=> "tableStyle", :index=>0).cells[idex].links[0].click
  return generateResult('true','pass','clicked')
end
#================================================
#checks for the existense of an DropDown
def Method_isDropDownExist(object)
  objectHash =  method_HandleFrameObjects(object)  
  flag = 0
   
 case objectHash.length
   when 2
   puts "frame"
   if $browser.frame(eval(objectHash[0])).select_list(eval(objectHash[1])).exists? then
     flag = 1          
    end     
   when 1
   puts "no frame"
   if $browser.select_list(eval(objectHash[0])).exists? then
     flag = 1          
   end
 end  
 
 if  (flag == 1) then
    return generateResult('true','pass','DropDown exists.')
 else
    return generateResult('false','pass','DropDown not exists.') 
 end
end
#================================================
#checks for the existense of an TextBox/TextField
def Method_isTextFieldExist(object)
  objectHash =  method_HandleFrameObjects(object)  
  flag = 0
 
 case objectHash.length
   when 2
   puts "frame"
   if $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).exists? then
     flag = 1          
    end     
   when 1
   puts "no frame"
   if $browser.text_field(eval(objectHash[0])).exists? then
     flag = 1          
   end
 end  
 
 if  (flag == 1) then
    return generateResult('true','pass','TextField exists.')
 else
    return generateResult('false','pass','TextField not exists.') 
 end
end

#================================================
#checks for the existense of an button
def Method_isButtonExist(object)
  objectHash =  method_HandleFrameObjects(object)  
  flag = 0
 
 case objectHash.length
   when 2
   puts "frame"
   if $browser.frame(eval(objectHash[0])).button(eval(objectHash[1])).exists? then
     flag = 1          
    end     
   when 1
   puts "no frame"
   if $browser.button(eval(objectHash[0])).exists? then
     flag = 1          
   end
 end  
 
 if  (flag == 1) then
    return generateResult('true','pass','Button exists.')
 else
    return generateResult('false','pass','Button not exists.') 
 end
end
#==========================================get text sucharu==
def Method_getTextfromEditBox(object)  
  if(text.casecmp("nuLL")== 0)
          return generateResult('true','pass','step not executed')
  end  
  objectHash =  method_HandleFrameObjects(object)
  #frame(:index => '5').text_vj(:name => 'pUserName')
  case objectHash.length
  when 2
#    puts "when2"
#    puts objectHash[0]
#    puts objectHash[1]
   text_get = $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).text
    return generateResult('true','pass',text_get)
  when 1   
#    puts "when1"
    textStr = objectHash[0].gsub("\"","'")
    $browser.text_field(eval(textStr)).set text
    return generateResult('true','pass',text_get)
  end
end


#/*****************************************************
#   PERSONAL DETAILS TAB #
#   DATE : 15 MARCH 2013
#/*****************************************************
def handlePersonalDetails(goodHealth, height, heightUnit, weight, weightUnit)
  _frameIndex = 5
  _propval = 'propValues'
  _suffix = 1
  tempMessage = 'PersonalDetails Starts'
  begin
    _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
    tempMessage = prepareTempMessage(tempMessage, 'checking the existence of' + _propConcat)
    if $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).exists? then
      tempMessage = prepareTempMessage(tempMessage, _propConcat + ' exists for goodHealth DropDown')
      tempMessage = prepareTempMessage(tempMessage, goodHealth + ' selecting intiates')
      $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).select goodHealth
      tempMessage = prepareTempMessage(tempMessage, goodHealth + ' selected successfully')
      _suffix = _suffix + 1
      _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
    end
    tempMessage = prepareTempMessage(tempMessage, 'checking the existence of' + _propConcat)
    if $browser.frame(:index, _frameIndex).text_field(eval(_propConcat)).exists? then
      tempMessage = prepareTempMessage(tempMessage, _propConcat + ' exists for health TextField')
      tempMessage = prepareTempMessage(tempMessage, height + ' typing intiates')
      $browser.frame(:index, _frameIndex).text_field(eval(_propConcat)).set height
      tempMessage = prepareTempMessage(tempMessage, height + ' typed successfully')
      _suffix = _suffix + 1
      _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
    end
    tempMessage = prepareTempMessage(tempMessage, 'checking the existence of' + _propConcat)
    if $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).exists? then
      tempMessage = prepareTempMessage(tempMessage, _propConcat + ' exists for heightUnit DropDown')
      tempMessage = prepareTempMessage(tempMessage, heightUnit + ' selecting intiates')
      $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).select heightUnit
      tempMessage = prepareTempMessage(tempMessage, heightUnit + ' selected successfully')
      _suffix = _suffix + 1
      _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
    end
    tempMessage = prepareTempMessage(tempMessage, 'checking the existence of' + _propConcat)
    if $browser.frame(:index, _frameIndex).text_field(eval(_propConcat)).exists? then
      tempMessage = prepareTempMessage(tempMessage, _propConcat + ' exists for weight TextField')
      tempMessage = prepareTempMessage(tempMessage, weight + ' typing intiates')
      $browser.frame(:index, _frameIndex).text_field(eval(_propConcat)).set weight
      tempMessage = prepareTempMessage(tempMessage, weight + ' typed successfully')
      _suffix = _suffix + 1
      _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
    end
    tempMessage = prepareTempMessage(tempMessage, 'checking the existence of' + _propConcat)
    if $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).exists? then
      tempMessage = prepareTempMessage(tempMessage, _propConcat + ' exists for weightUnit DropDown')
      tempMessage = prepareTempMessage(tempMessage, weightUnit + ' selecting intiates')
      $browser.frame(:index, _frameIndex).select_list(eval(_propConcat)).select weightUnit
      tempMessage = prepareTempMessage(tempMessage, weightUnit + ' selected successfully')
      _suffix = _suffix + 1
      _propConcat = "{:name => " + "'" + (_propval + _suffix.to_s) + "'" + "}"
      return generateResult('true','pass',tempMessage)
    end
  rescue Exception => e
    tempMessage = prepareTempMessage(tempMessage, e.to_s)
    puts  tempMessage
    return generateResult('false','fail',tempMessage)
  end
end

#/*****************************************************
#   HANDLE MEDICAL REQUIREMENT # FAMILY INCOME PLAN
#   DATE : 14 MARCH 2013
#/*****************************************************

def handleMedicalRequirement (recieveDate)
  _frameIndex = 5
  _propval = 'propValues'
  _MRSelectCounter = 0
  _MRSatusProperty = "{:name => " + "'" + (_propval + (_MRSelectCounter+1).to_s) + "'" + "}"
  _buttonName = 'Next'
  tempMessage = 'MRCountingStarts'
  _flagForClickingNextButton = false
  _timeInSec = 2

  begin
    #Fetching No Of Medical requirement field data 
  if $browser.frame(:index, _frameIndex).text_field(eval(_MRSatusProperty)).exists? and ($browser.frame(:index, _frameIndex).text_field(eval(_MRSatusProperty)).text.to_i  == 0 or  $browser.frame(:index, _frameIndex).text_field(eval(_MRSatusProperty)).text.to_i > 0)
  _MRSelectCounter = _MRSelectCounter + 1
  _MRSatusProperty = "{:name => " + "'" + (_propval + (_MRSelectCounter+1).to_s) + "'" + "}"
  _flagForClickingNextButton = true  
  
    while $browser.frame(:index, _frameIndex).select_list(eval(_MRSatusProperty)).exists?
      tempMessage = prepareTempMessage(tempMessage, ('MRCount reaches' + _MRSelectCounter.to_s))

      tempMessage = prepareTempMessage(tempMessage, ('MR' + _MRSelectCounter.to_s) + 'status about to set Recieved')
      $browser.frame(:index, _frameIndex).select_list(eval(_MRSatusProperty)).select 'Received'
      sleep _timeInSec.to_f
      tempMessage = prepareTempMessage(tempMessage, ('MR' + _MRSelectCounter.to_s) + 'status is set Recieved successfully')

      _MRSelectCounter = _MRSelectCounter + 1
      _MRSatusProperty = "{:name => " + "'" + (_propval + (_MRSelectCounter+1).to_s) + "'" + "}"
    end

    puts '_MRSelectCounter is :::' + _MRSelectCounter.to_s

    tempMessage = prepareTempMessage(tempMessage, ('about to fill the MRRecievedDate'))

    #????? Medical Requirement Date
    for _MRDateCount in 1.._MRSelectCounter - 1
      #_flagForClickingNextButton = true
      _MRDateProperty = "{:name => " + "'" + (_propval + (_MRDateCount + _MRSelectCounter).to_s) + "'" + "}"

      tempMessage = prepareTempMessage(tempMessage, ('about to fill the MRRecievedDate for ' + ('MRDate' + _MRDateCount.to_s)))
      $browser.frame(:index, _frameIndex).text_field(eval(_MRDateProperty)).set recieveDate
      sleep _timeInSec.to_f
      tempMessage = prepareTempMessage(tempMessage, ('filled successfully for MRRecievedDate ' + ('MRDate' + _MRDateCount.to_s)))
    end    
  end  
    
    if (_flagForClickingNextButton)    
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
end

#/*****************************************************
#   HANDLE FINANCIAL REQUIREMENT # FAMILY INCOME PLAN
#   DATE : 14 MARCH 2013
#/*****************************************************
def handleFinancialRequirement (recieveDate)

  _frameIndex = 5
  _propval = 'propValues'
  _FRSelectCounter = 1
  _buttonName = 'Next'
  _flagForClickingNextButton1st = false
  _flagForClickingNextButton2nd = false
  _timeInSec = 1
  
  _FRStatusProperty = "{:name => " + "'" + (_propval + _FRSelectCounter.to_s) + "'" + "}"
    
  tempMessage = 'FRCounting Starts'

  begin

    while $browser.frame(:index, _frameIndex).select_list(eval(_FRStatusProperty)).exists?
      _flagForClickingNextButton1st = true
      tempMessage = prepareTempMessage(tempMessage, ('FR' + _FRSelectCounter.to_s) + 'status about to set Recieved')
      $browser.frame(:index, _frameIndex).select_list(eval(_FRStatusProperty)).select 'Received'
      sleep _timeInSec.to_f
      tempMessage = prepareTempMessage(tempMessage, ('FR' + _FRSelectCounter.to_s) + 'status is set Recieved successfully')
      _FRSelectCounter = _FRSelectCounter + 1
      
      _FRStatusProperty = "{:name => " + "'" + (_propval + _FRSelectCounter.to_s) + "'" + "}"
    end
    
    if(_flagForClickingNextButton1st)
      #click next
      tempMessage = prepareTempMessage(tempMessage, 'nextButton click starts')
      $browser.frame(:index, _frameIndex).button(:name, _buttonName).click
      tempMessage = prepareTempMessage(tempMessage, 'nextButton clicked')
    end

    puts '_FRSelectCounter' + _FRSelectCounter.to_s    
    for _FRDateCount in 1.._FRSelectCounter - 1
      _FRDateProperty = "{:name => " + "'" + (_propval + _FRDateCount .to_s) + "'" + "}"      
      if $browser.frame(:index, _frameIndex).text_field(eval(_FRDateProperty)).exists?
	      _flagForClickingNextButton2nd = true
	      tempMessage = prepareTempMessage(tempMessage, ('about to fill the FRRecievedDate for ' + ('MRDate' + _FRDateCount.to_s)))
	      $browser.frame(:index, _frameIndex).text_field(eval(_FRDateProperty)).set recieveDate
        sleep _timeInSec.to_f
	      tempMessage = prepareTempMessage(tempMessage, ('filled successfully for FRRecievedDate ' + ('MRDate' + _FRDateCount.to_s)))
      end
    end

    if(_flagForClickingNextButton2nd)
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

end


#===========================================================
#==============================================================
def Method_IsTextExistInTextField(object, text)  

 objectHash =  method_HandleFrameObjects(object)
  puts "entering textfield"
  #frame(:index => '5').text_vj(:name => 'pUserName')
  case objectHash.length
  when 2
 puts "checking textfield"
#    puts objectHash[0]
#    puts objectHash[1]
   if $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).text.include? ""
    return generateResult('true','pass',"blank")
    else 
	    return generateResult('true','pass',"not blank")
    end
    end
end

#========================================
#==============================================================
def Method_waitforobject(object)  

 objectHash =  method_HandleFrameObjects(object)
  case objectHash.length
  when 2
    $browser.frame(eval(objectHash[0])).input(eval(objectHash[1])).when_present
    return generateResult('true','pass',"object Present")
    when 1
     $browser.input(eval(objectHash[1])).when_present
	    return generateResult('true','pass',"Object Present")
    end
end

#========================================


def clickMenuInclaim(input)  
	if(input.casecmp("nuLL")== 0)
          return generateResult('true','pass','step not executed')
  end  
	
  case input
  when "Assured Details"
    idex = 0
  when "Document"
    idex = 1
  when "Relations"
    idex = 2
  when "Reserve"
    idex = 3
  when "Payment"
    idex = 4
  when "Attributes"
    idex = 5
  when "Notes"
    idex = 6
  end      
  $browser.frame(:name, "display").table(:class=> "tableStyle", :index=>1).cells[idex].links[0].flash
  sleep(2)
  $browser.frame(:name, "display").table(:class=> "tableStyle", :index=>1).cells[idex].links[0].click
  return generateResult('true','pass','clicked')
end
