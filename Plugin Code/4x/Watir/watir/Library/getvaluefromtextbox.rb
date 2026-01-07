require "win32ole"

#================================================
#getvaluefromtextbox____get PolicyNumber
def Method_getvaluefromtextbox(object)
  objectHash =  method_HandleFrameObjects(object)
  data = "no data found"
  case objectHash.length
  when 2
   data = $browser.frame(eval(objectHash[0])).text_field(eval(objectHash[1])).value
    
  when 1
   data = $browser.text_field(eval(objectHash[0])).value    
  end
  if data == ""
	  data = 'Null'
  end
   return generateResult( data,'pass','item is selected')
end
#================================================