require "win32ole"

def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('')
  return newTempMsg
end

#click on Proceed button (Approve & Issue Policy If PO is using in another policy)
def Method_clickproceedButtonOnPopUp()
	/puts "Entering the function and about to click"
	$browser.button(:name => "Proceed").focus
	
    $browser.button(:name => "Proceed").click    
    puts "clicked onPopUp"/
    au3 = WIN32OLE.new("AutoItX3.Control")
    
if (au3.WinExists("[REGEXPTITLE:\Pop up Window - \]") == 0)
	 return generateResult('true','pass',"step not executed ,window not exists")
end
    
    
	timeInSec = 4

tempMsg = 'starts by method One'
	#Handle by AUTO IT
  
  au3.WinActivate("[REGEXPTITLE:\Pop up Window - \]")
  puts "popup.1"
  tempMsg = prepareTempMessage(tempMsg,'before alt F4')
 
  
  if (au3.WinExists("[REGEXPTITLE:\Pop up Window - \]") == 1)
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