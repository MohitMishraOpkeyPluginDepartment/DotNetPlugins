#
#Author:: SANTOSH Kumar EMP ID_E328
#Started:: on 2nd Feb 2013
#

require 'watir'

#require '.\opkeypluginbase\functionresult'

#================================================
# Web Browser Open
def Method_WebBrowserOpen(browserType, url)
  puts "Opening url #{url} on #{browserType}"
  
  $browser = Watir::Browser.new()
  $browser.maximize
  $browser.goto url
    return generateResult('true','pass','web browser opened sucessfully')
end

#================================================
#checks for the existense of an DropDown
def Method_verifyDropDownExist(object)
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
    return generateResult('false','fail','DropDown not exists.') 
 end
end

#================================================
#checks for the existense of an button
def Method_verifyButtonExist(object)
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
    return generateResult('false','fail','Button not exists.') 
 end
end
#================================================
#checks for the existense of an TextBox/TextField
def Method_verifyEditBoxExist(object,garbageTime)
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
    return generateResult('false','fail','TextField not exists.') 
 end
end
#================================================
# types text on editbox
def Method_typeTextOnEditBox(object,text)  
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
    $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).set text
    return generateResult('true','pass','typed text on text field inside frame')
  when 1   
#    puts "when1"
    textStr = objectHash[0].gsub("\"","'")
    $browser.text_field(eval(textStr)).set text
    return generateResult('true','pass','typed text on text field')
  end
end
#================================================
#waits for given time
def Method_wait(timeInSec)
  sleep timeInSec.to_f
  #generate and return result
  return generateResult('true','pass','wait is successfully performed')
end
#================================================
#Select checkbox
def Method_selectCheckBox(object, statusValue)
  if(statusValue.casecmp("nuLL") == 0)
    return generateResult('true','pass','step not executed')
  end

  objectHash =  method_HandleFrameObjects(object)
  # ie1.radio(:name=> "pPartyType", :index=>1).set
  case objectHash.length
  when 2
    puts "frame"
    $browser.frame(eval(objectHash[0])).checkbox(eval(objectHash[1])).set(1)

  when 1
    puts "no frame"
    $browser.checkbox(eval(objectHash[0])).set(1)
  end
  
  return generateResult('true','pass','checkbox selected.')
end
#================================================
#click on the given object
def Method_ObjectClick(object)
  objectHash =  method_HandleFrameObjects(object)
  case objectHash.length
  when 2
    $browser.frame(eval(objectHash[0])).link(eval(objectHash[1])).click
    return generateResult('true','pass','clicked on button inside frame')
  when 1
    $browser.link(eval(objectHash[0])).click
    return generateResult('true','pass','clicked on button')
  end
end
#================================================
#select dropdown item
def Method_selectDropDownItem(object,item)
  if(item.casecmp("nuLL") == 0)
      return generateResult('true','pass','step not executed')
  end
  objectHash =  method_HandleFrameObjects(object)
  case objectHash.length
  when 2
    $browser.frame(eval(objectHash[0])).select_list(eval(objectHash[1])).select item
    return generateResult('true','pass','item is selected')
  when 1
    $browser.select_list(eval(objectHash[0])).select item
    return generateResult('true','pass','item is selected')
  end
end
#================================================
#type text in text area
def Method_typeTextInTextArea(object, text)
  if(text.casecmp("nuLL") == 0)
        return generateResult('true','pass','step not executed')
  end
  Method_typeTextOnEditBox(object, text)
end
#================================================
#set focus
def Method_SetFocus(object)
  objectHash =  method_HandleFrameObjects(object)
  _elementArray = Array.[]('button','select','text_field','link')
  case objectHash.length
  when 2
	  for elementAtIndex in 0..(_elementArray.length - 1)
		commandStringExist = "$browser.frame(eval(objectHash[0])).#{_elementArray[elementAtIndex]}(eval(objectHash[1])).exists?"
		commandStringFlash = "$browser.frame(eval(objectHash[0])).#{_elementArray[elementAtIndex]}(eval(objectHash[1])).flash"  
		commandStringFocus = "$browser.frame(eval(objectHash[0])).#{_elementArray[elementAtIndex]}(eval(objectHash[1])).focus"  
		if  eval(commandStringExist) then
			#eval(commandStringFlash)
			#eval(commandStringFocus)			
			break
		end 
	  end
    
  when 1  
	for elementAtIndex in 0..(_elementArray.length - 1)
		commandStringExist = "$browser.#{_elementArray[elementAtIndex]}(eval(objectHash[0])).exists?"
		commandStringFlash = "$browser.#{_elementArray[elementAtIndex]}(eval(objectHash[0])).flash"  
		commandStringFocus = "$browser.#{_elementArray[elementAtIndex]}(eval(objectHash[0])).focus"  
		if  eval(commandStringExist) then
			#eval(commandStringFlash)
			#eval(commandStringFocus)			
			break
		end 
	  end  
  end
  
  eval(commandStringFlash)
  eval(commandStringFocus)			

  return generateResult('true','pass','item is focused')  
end
#================================================
def Method_SetfocusEditFieldNew(object)
  objectHash =  method_HandleFrameObjects(object)
  case objectHash.length
  when 2
    $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).flash
    $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).focus
    return generateResult('true','pass','item is selected')
  when 1
    $browser.text_field(eval(objectHash[0])).flash
    $browser.text_field(eval(objectHash[0])).focus
    return generateResult('true','pass','item is selected')
  end
end
#================================================
def Method_reportMessage(message, status)
    if status == 'true'
       status = 'pass'
    end
    if status == 'false'
      status = 'fail'
    end      
    return generateResult('message reported',status,message)
end
#================================================
#logout (name in opkey ---> clickInTable)
def Method_logout()
  
  $browser.frame(:name, "head").table(:index=> 3).links[3].flash
  sleep(1)
  $browser.frame(:name, "head").table(:index=> 3).links[3].click
  return generateResult('true','pass','clicked')
end
#================================================
#click on the given button
def Method_clickButton(object)
  objectHash =  method_HandleFrameObjects(object)  
  puts "checked"
  puts objectHash[0]
puts "checked2"
  puts objectHash[1]
  case objectHash.length
  when 2
    $browser.frame(eval(objectHash[0])).button(eval(objectHash[1])).click
    puts "frame"
    return generateResult('true','pass','clicked on button inside frame')
  when 1
    $browser.button(eval(objectHash[0])).click
    puts "no frame"
    return generateResult('true','pass','clicked on button')
  end
end

#================================================
#checks for the existense of an onject
def Method_exists(object)
  #initialise the flag value
  flag = 0
  while (flag == 0)
    if $browser.text_field(object).exists? then
      flag = 1
      break
    elsif $browser.select_list(object).exists? then
      flag = 1
      break
    elsif $browser.button(object).exists? then
      flag = 1
      break
    end
  end
  #generate and return result
  return generateResult('true','pass','item exists.')
end
#================================================
def Method_selectWindow(titleText)
  
  tme = 102  
  selectFlag = false
    while tme > 1 and selectFlag == false
       begin
       #with regex Support 
	$browser = Watir::Browser.attach(:title,(/#{titleText}/))
	#without regex Support
        #$browser = Watir::Browser.attach(:title,titleText)
        selectFlag = true
      rescue Watir::Exception::NoMatchingWindowFoundException => ex        
        selectFlag = false
        puts "#{tme}"
        tme = tme -3
        sleep 1
        mess = "Failed to find new pop up window! #{ex}"
      rescue Exception => ex
        mess = "Failed to find new pop up window! #{ex}"
      end
    end  
  if (selectFlag == true)
    return generateResult('true','pass',"Window with title : #{titleText} is selected")
  else    
    return generateResult('false','pass',mess)
  end
end



#***********************************************
#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
# this is the PRIAVTE SEGMENT for this file
#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
#***********************************************

#this function was written to handle frames and rewrite the object properties
def method_HandleFrameObjects(obj)
  
  index = 0
  frameindex = 0
  properties= "no object"
  frameObject = "no frame object"
  returnArray = Array.new
  tempProperty = ""

  #
  #SAMPLE:: object = "{:name =>'btnFindFlights',:id=>'btnFindFlights',:frame => 'frameName'}"
  #
  
  obj =  obj.to_s
  
  #puts obj
  if obj.include?(":frame")== true  then
    #splits the object by delimiter <,>
    arr = obj.split(",")

    arr.each do |arrelement|
      
      #check the arrayelements one by one if <:frame> exists
      if arrelement.include? ":frame" then
        frameindex = index
        # SAMPLE:: :frame => 'frameName'
        frameElement = arrelement.split("=>")
        # SAMPLE:: frameName
#        puts frameElement
        frameElement =  frameElement[1].gsub("\"" , "")
       
        # SAMPLE:: frameName} replacing <}> with <""> when frame is the last entry in object
        if frameindex == arr.length - 1
          frameElement = frameElement.gsub("}" , "")
        else
          frameElement = frameElement
        end

        #
        # uses REGEX to identify wheter the frameElement is aplphabetic or not
        # SAMPLE:: frameName
        #
        matchedOutput = /\D/.match(frameElement)

        #
        # matchedOutput.class.name = MatchData  <when match = pattern >
        # matchedOutput.class.name = NilClass  <when match != pattern >
        #

        case matchedOutput.class.name

        when "NilClass"
          frameObject = "{:index => " + "'"  +  frameElement + "'" + "}"
        when "MatchData"
          frameObject = "{:name => " + "'" +  frameElement + "'" + "}"          
        end

      else
        puts arrelement
        tempProperty = tempProperty + arrelement + ", "
      end
      index = index + 1
    end

    #  puts frameindex
    if frameindex == arr.length - 1 
      properties = tempProperty[0...-2] + "}"
    elsif frameindex == 0
      properties = tempProperty[0...-2]
      properties = '{' + properties
    else
      properties = tempProperty[0...-2]  
    end
    
    properties = properties.gsub("\"","'")
#    properties = properties.gsub(" ","")
    puts properties
    puts frameObject
    returnArray.push frameObject
    returnArray.push properties
    
    puts "returnArray"
    return returnArray

  else
    obj = obj.gsub("=>"," => ")
    returnArray.push obj
    puts "eval object"
    return returnArray

  end # if End <include ?>
end # function

def generateResult(output, status, message)

  res = OpKeyPluginBase::FunctionResult.new
  res.setOutput(output)
  res.setStatus(status)
  res.setMessage(message)

  return res
end

#Method_WebBrowserOpen("internet explorer","192.168.200.92:9999/IIMS/")
#obj = {:frame => '5',:name => 'pUserName',:id => '34'}
#Method_typeTextOnEditBox(obj , "jdhfjhjdf")

