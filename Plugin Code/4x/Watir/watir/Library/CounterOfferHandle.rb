require 'watir'

#$browser = Watir::Browser.attach(:title,//)

def prepareTempMessage(prevTempMsg,*others)
  newTempMsg = prevTempMsg + '::' + others.join('') 
  return newTempMsg
end

def counterOfferDetails (term, counterOfferPremium, flatExtraBase, flatExtraBasePeriod, emrRateForBase, emrRateForBasePeriod, reason1, reason2, reason3, reason4, reason5)
 
  termValues = Array.new
  propval = 'propValues'
  _frameIndex = '5'
  _suffix = 1
  _buttonName = 'Next'
  _first_1FoundIndexFlag = false
   _first_2FoundIndexFlag = false
  _first_3FoundIndexFlag = false
  _first_4FoundIndexFlag = false
  _counterReasonFlag = false
  _preniumFlag = false
  
  if    $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	_first_1FoundIndexFlag = true
	puts "start from propvalue1"
end

_suffix = 2
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_2FoundIndexFlag = true
		puts "start from propvalue2"
end	
_suffix = 3
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_3FoundIndexFlag = true
		puts "start from propvalue3"
end

_suffix = 4
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_4FoundIndexFlag = true
		puts "start from propvalue4"
end

if _first_1FoundIndexFlag == true then 
_suffix = 1
tempMessage = 'start from propvalue1'
end

if  (_first_1FoundIndexFlag == false and _first_2FoundIndexFlag == true) then
_suffix = 2
tempMessage = 'start from propvalue2'
end

if  (_first_1FoundIndexFlag == false and  _first_2FoundIndexFlag == false and _first_3FoundIndexFlag == true) then
_suffix = 3
tempMessage = 'start from propvalue3'
end

if  (_first_1FoundIndexFlag == false and  _first_2FoundIndexFlag == false and _first_3FoundIndexFlag == false and _first_4FoundIndexFlag == true) then 
_suffix = 4
tempMessage = 'start from propvalue4'
puts "flag set at propvalue 4"
end




  #~ =================================================================
#~ if    $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	#~ _first_2FoundIndexFlag = true
	#~ puts "start from propvalue2"
#~ else
    #~ _suffix = 3
	#~ if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		#~ _first_3FoundIndexFlag = true
		#~ puts "start from propvalue3"
	#~ else
		#~ _suffix = 4
		#~ if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		#~ _first_4FoundIndexFlag = true
		#~ puts "start from propvalue4"
		#~ end
	#~ end  
#~ end
#~ =====================================================================

_suffix = _suffix+1
puts _suffix.to_s
if term != "Null" then 
	if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then 
		tempMessage = prepareTempMessage(tempMessage, 'term start to type', term)
		$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).set term
		puts "term set at " + _suffix.to_s
		tempMessage = prepareTempMessage(tempMessage, 'term typed', term)
	end
end

_suffix = _suffix+2
if counterOfferPremium != "Null" then 
	if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		tempMessage = prepareTempMessage(tempMessage, 'counterOfferPremium start to select', counterOfferPremium)
	$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select counterOfferPremium
	puts "counterOffer select at " + _suffix.to_s
	  _preniumFlag = true
	  tempMessage = prepareTempMessage(tempMessage, 'counterOfferPremium selected', counterOfferPremium)
	end
end
if  _preniumFlag == false then 
	_suffix = _suffix-1
end

_suffix = _suffix+1
if flatExtraBase != "Null" then 
      if  $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	      tempMessage = prepareTempMessage(tempMessage, 'flatExtraBase start to type', flatExtraBase)
	$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).set flatExtraBase
	puts "flatExtra set at " + _suffix.to_s
	tempMessage = prepareTempMessage(tempMessage, 'FlatExtraBase typed', flatExtraBase)
	end
end 

_suffix = _suffix+1
if flatExtraBasePeriod != "Null" then 
	if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		tempMessage = prepareTempMessage(tempMessage, 'flatExtraBasePeriod start to type', flatExtraBasePeriod)
	$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).set flatExtraBasePeriod
	puts "flatExtraBasePeriod set at " + _suffix.to_s
	tempMessage = prepareTempMessage(tempMessage, 'flatExtraBaseperiod typed', flatExtraBasePeriod)
	end
end


_suffix = _suffix+1
puts "EMR Selection"
if emrRateForBase != "Null" then 
	if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		tempMessage = prepareTempMessage(tempMessage, 'EMRRateforBase start to type', emrRateForBase)
		$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).set emrRateForBase
		tempMessage = prepareTempMessage(tempMessage, 'EMRRateforBase typed', emrRateForBase)
		#puts "EMR set at " + _suffix.to_s
	end
		_suffix = _suffix+1
	if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		tempMessage = prepareTempMessage(tempMessage, 'EMRRateforBasePeriod start to type', emrRateForBasePeriod)
	$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).set emrRateForBasePeriod
	tempMessage = prepareTempMessage(tempMessage, 'EMRRateforBaseperiod typed', emrRateForBasePeriod)
	#puts "EMR Period set at " + _suffix.to_s
	end
end 

_suffix = 11
_endsuffix = 30
puts "reason selection"
for _suffix in 11..35
	puts "enter in for loop" + _suffix.to_s
	if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	_suffix1 = _suffix+1
	puts "suffix for first reason" + _suffix1.to_s
		if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix1.to_s + "'" + "}")).exists? then
		_suffix2 = _suffix1+1
		puts "suffix for 2nd reason" + _suffix2.to_s
			if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix2.to_s + "'" + "}")).exists? then
			_suffix3 = _suffix2+1
			puts "suffix for 3rd reason" + _suffix3.to_s
				if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix3.to_s + "'" + "}")).exists? then
				 puts "4 counter offer reason are present"
				 puts "suffix for 4th reason" + _suffix3.to_s
				 _suffix4 = _suffix3+1
				 if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix4.to_s + "'" + "}")).exists? then
					  puts "5 counter offer reason are present"
					#puts "suffix for 5th reason" + _suffix4.to_s
					_counterReasonFlag = true
					_newsuffix = _suffix4
					break
				end
				else
					puts "enter in else" + _suffix.to_s
					next
				end
			else
				puts "enter in else" + _suffix.to_s
				next
			end
		else
			puts "enter in else" + _suffix.to_s
			next
		end
	else
		puts "enter in else" + _suffix.to_s
		next
	end
end 

	if  _counterReasonFlag == true then
		_suffix = _newsuffix
		if reason5 != "Null" then 
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select reason5
			tempMessage = prepareTempMessage(tempMessage, 'reason5 selected', reason5)
		end 
		_suffix = _suffix-1
		if reason4 != "Null" then 
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select reason4
			tempMessage = prepareTempMessage(tempMessage, 'reason4 selected', reason4)
		end 
		
		_suffix = _suffix-1
		if reason3 != "Null" then 
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select reason3
			tempMessage = prepareTempMessage(tempMessage, 'reason3 selected', reason3)
		end 
		
		_suffix = _suffix-1
		if reason2 != "Null" then 
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select reason2
			tempMessage = prepareTempMessage(tempMessage, 'reason2 selected', reason2)
		end 

		_suffix = _suffix-1
		if reason1 != "Null" then 
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select reason1
			tempMessage = prepareTempMessage(tempMessage, 'reason1 selected', reason1)
		end 
	end

    #~ #  tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed') 
     return generateResult('true','pass', tempMessage)
      
   rescue Exception => e
        tempMessage = prepareTempMessage('true', e.to_s)
	puts 'myerror'
        #puts  tempMessage 
        return generateResult('false','fail', tempMessage)      
   end

#end # function
#end

def counterOfferstatusSelection (status,document)
  propval = 'propValues'
  _frameIndex = '5'
  _suffix = 2
_statusSelection = false
_counterOfferStatus_1Flag= false
_counterOfferStatus_2Flag= false
_counterOfferStatus_3Flag= false

if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
_counterOfferStatus_1Flag= true
end
_suffix = 5
if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
_counterOfferStatus_2Flag= true
end
_suffix = 6
if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
_counterOfferStatus_3Flag= true
end

if (_counterOfferStatus_1Flag == true and _counterOfferStatus_2Flag == false and _counterOfferStatus_3Flag == false) then
_suffix = 2
tempMessage = 'start from suffix 2'
end

if (_counterOfferStatus_1Flag == false and _counterOfferStatus_2Flag == true and _counterOfferStatus_3Flag == false) then
_suffix = 5
tempMessage = 'start from suffix 5'
end

if (_counterOfferStatus_1Flag == false and _counterOfferStatus_2Flag == false and _counterOfferStatus_3Flag == true) then
_suffix = 6
tempMessage = 'start from suffix 6'
end


if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	tempMessage = prepareTempMessage(tempMessage, 'counter dropdown started', status)
	$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select status
	 _suffix =  _suffix+2
		if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
			tempMessage = prepareTempMessage(tempMessage, 'document dropdown started', document)
			$browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).select document
			_statusSelection = true
		end 
end
	

   return generateResult('true','pass', tempMessage)
      
   rescue Exception => e
        tempMessage = prepareTempMessage('true', e.to_s)
	puts 'myerror'
        puts  tempMessage 
        return generateResult('false','fail','true')      
   end


#~ term = "3"
#~ counterOfferPremium = "Limited Pay"
#~ flatExtraBase = "2"
#~ flatExtraBasePeriod = "3"
#~ emrRateForBase = "Null"
#~ emrRateForBasePeriod = "Null"
#~ reason1 = "Blood Disorders"
#~ reason2 = "Null"
#~ reason3 = "Null"
#~ reason4 = "Null"
#~ reason5 = "Null"

#~ counterOfferDetails(term, counterOfferPremium, flatExtraBase, flatExtraBasePeriod, emrRateForBase, emrRateForBasePeriod, reason1, reason2, reason3, reason4, reason5)

def counterOfferDetailsForCounterOffer (counterOfferSA)
 
  termValues = Array.new
  propval = 'propValues'
  _frameIndex = '5'
  _suffix = 1
  _buttonName = 'Next'
  _first_1FoundIndexFlag = false
   _first_2FoundIndexFlag = false
  _first_3FoundIndexFlag = false
  _first_4FoundIndexFlag = false
  _counterReasonFlag = false
  _preniumFlag = false
  
  if    $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	_first_1FoundIndexFlag = true
	puts "start from propvalue1"
end

_suffix = 2
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_2FoundIndexFlag = true
		puts "start from propvalue2"
end	
_suffix = 3
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_3FoundIndexFlag = true
		puts "start from propvalue3"
end

_suffix = 4
if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
		_first_4FoundIndexFlag = true
		puts "start from propvalue4"
end

if _first_1FoundIndexFlag == true then 
_suffix = 1
end

if  (_first_1FoundIndexFlag == false and _first_2FoundIndexFlag == true) then
_suffix = 2
end

if  (_first_1FoundIndexFlag == false and  _first_2FoundIndexFlag == false and _first_3FoundIndexFlag == true) then
_suffix = 3
end

if  (_first_1FoundIndexFlag == false and  _first_2FoundIndexFlag == false and _first_3FoundIndexFlag == false and _first_3FoundIndexFlag == true) then 
_suffix = 4
end

_suffix = _suffix+1

_suffix = _suffix+2

	if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	  _preniumFlag = true
	end
if  _preniumFlag == false then 
	_suffix = _suffix-1
end

_suffix = _suffix+1
_suffix = _suffix+1
_suffix = _suffix+1
_suffix = _suffix+1

_suffix = 11
_endsuffix = 30
puts "reason selection"
for _suffix in 11..35
	puts "enter in for loop" + _suffix.to_s
	if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix.to_s + "'" + "}")).exists? then
	_suffix1 = _suffix+1
	puts "suffix for first reason" + _suffix1.to_s
		if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix1.to_s + "'" + "}")).exists? then
		_suffix2 = _suffix1+1
		puts "suffix for 2nd reason" + _suffix2.to_s
			if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix2.to_s + "'" + "}")).exists? then
			_suffix3 = _suffix2+1
			puts "suffix for 3rd reason" + _suffix3.to_s
				if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix3.to_s + "'" + "}")).exists? then
				 puts "4 counter offer reason are present"
				 puts "suffix for 4th reason" + _suffix3.to_s
				 _suffix4 = _suffix3+1
				 if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _suffix4.to_s + "'" + "}")).exists? then
					  puts "5 counter offer reason are present"
					puts "suffix for 5th reason" + _suffix4.to_s
					_counterReasonFlag = true
					_newsuffix = _suffix4
					break
				end
				else
					puts "enter in else" + _suffix.to_s
					next
				end
			else
				puts "enter in else" + _suffix.to_s
				next
			end
		else
			puts "enter in else" + _suffix.to_s
			next
		end
	else
		puts "enter in else" + _suffix.to_s
		next
	end
end 

_newsuffixForcounterOfferSA = _newsuffix +1
puts 'checking SA'
if $browser.frame(:index, _frameIndex).select_list(eval("{:name => " + "'" + propval + _newsuffixForcounterOfferSA.to_s + "'" + "}")).exists? then
_newsuffixForcounterOfferSA = _newsuffixForcounterOfferSA +2
puts 'OtherCounterReason found'
tempMessage = 'OtherCounterReason found'
else
_newsuffixForcounterOfferSA = _newsuffixForcounterOfferSA +1
tempMessage = 'OtherCounterReason not found'
puts 'OtherCounterReason not found'
end

if counterOfferSA != 'Null' then 
	 if $browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _newsuffixForcounterOfferSA.to_s + "'" + "}")).exists? then
		$browser.frame(:index, _frameIndex).text_field(eval("{:name => " + "'" + propval + _newsuffixForcounterOfferSA.to_s + "'" + "}")).set counterOfferSA
		tempMessage = prepareTempMessage(tempMessage, 'CounterOfferSA set', counterOfferSA) 
		puts 'counteroffer sa'
	end
end
    #  tempMessage = prepareTempMessage(tempMessage, 'otherRisk typed') 
     return generateResult('true','pass',tempMessage)
      
   rescue Exception => e
        tempMessage = prepareTempMessage('true', e.to_s)
	puts 'myerror'
        #puts  tempMessage 
        return generateResult('false','fail',tempMessage)      
   end



#counterOfferDetailsForCounterOffer('500000')