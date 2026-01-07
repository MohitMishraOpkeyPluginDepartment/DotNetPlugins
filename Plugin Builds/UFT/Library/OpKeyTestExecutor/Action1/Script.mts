'Note:
'1. Any extra or unused file should not be placed in below mentioned folders
'		a. PluginBase
'		b. UftPlugin
'		c. UftPlugin/keywords'
'2. <g_page> is a global varaible which wraps <Browser("B").page("P")> at any time of Suite.
'3. For registered <error code> refer <codes.qfl>
'4. 

Call pluginInitiator()




 @@ hightlight id_;_Browser("MSN India - News, Cricket,").Page("List of Bollywood films").Link("Aditya Pancholi")_;_script infofile_;_ZIP::ssf38.xml_;_
'set obj = Browser("MSN India - News, Cricket,").Page("The input element - HTML5").WebEdit("comments") @@ hightlight id_;_Browser("MSN India - News, Cricket,").Page("The input element - HTML5").WebEdit("comments")_;_script infofile_;_ZIP::ssf39.xml_;_
'obj.highlight
'
'
'
'
'MsgBox "maxlength " & obj.GetROProperty("outerhtml")
'
'outerHtml = obj.GetROProperty("outerhtml")
'prp = Split(outerHtml)
'str = chr(34)
'MsgBox str
'for each x in prp
'
'  MsgBox x
'  If contains(x , "rows") Then
'  
'  	lengt = Split (x , "=")
'  	splitedArray = lengt (1)
'  	MsgBox splitedArray
'   	b = Split (splitedArray , str)
'   	MsgBox uBound(b)
'   	If uBound(b) >1 Then
'   		MsgBox " length " & b (1)
'   	else
'   		MsgBox b (0)
'  End If
'  End If
'   	
'   
'next
'
''MsgBox obj.GetROProperty("length")
