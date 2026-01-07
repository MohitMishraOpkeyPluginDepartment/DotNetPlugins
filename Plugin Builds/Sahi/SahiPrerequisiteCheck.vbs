println("Starting Sahi Prequisite Check")
set arrArgsByOpKey			=	WScript.Arguments
Dim path2SettingXml	:	path2SettingXml = arrArgsByOpKey(0)

main()

'-----------------------------------------------------------------
sub main()
  
  if CheckJava() = false then WScript.Quit -1
 
  println("Sahi Prequisite Check Passed")
End sub

function CheckJava()
println("2. Checking for Java")
Set objShell = CreateObject("WScript.Shell")
Set objEnv = objShell.Environment("System")
DIM PATH
PATH=objEnv("Path")
dim a 
a = split(PATH,";")
dim value
dim exist
For Each b in a
c=b+"\keytool.exe"
   Dim fso, msg   
   Set fso = CreateObject("Scripting.FileSystemObject")
   If (fso.FileExists(c)) Then
      exist=fso.FileExists(c)
   End If   
Next
If exist = True Then
CheckJava=true
println("2.Java check pass")
Else
CheckJava=false
println("2.Java check fail")
println("Set Java path till \jre7\bin ")
End If 

End Function

'-----------------------------------------------------------------
function CheckJavaScriptXpath()
    println("1.Checking for javascript-xpath.js")
	
	'println ("path2SettingXml" & path2SettingXml)
	'path2SahiBase = getValueOfNode ("SahiBase")
	path2SahiBase="..\..\SahiServer\build.xml"
	path2SahiBase=Replace(path2SahiBase,"build.xml","")
	println "path2SahiBase : " & path2SahiBase
	tempPath =  path2SahiBase & "\htdocs\spr\ext\javascript-xpath\javascript-xpath.js"
	path2ReadMe = path2SahiBase & "\htdocs\sspr\ext\javascript-xpath\README.txt"
	
	Set objFSO = CreateObject("Scripting.FileSystemObject")
	
	isExists =  (objFSO.FileExists(tempPath))	
	 If isExists <> 0 Then
		println("File javascript-xpath.js has been found, 'checking for its size")
		
		Set objFile = objFSO.GetFile(tempPath)	
		xpathFileSize = objFile.Size
		println("File javascript-xpath.js Size:  " & xpathFileSize)
		If xpathFileSize > 0 Then
			CheckJavaScriptXpath = true  
			Exit Function
		Else
			
			println("")
			println("File javascript-xpath.js size is zero (0).")				
		 End IF
	else
	 
        println("")
		println("File javascript-xpath.js is not present.")		
    End If
	
	println("Kindly refer "& path2ReadMe &" and follow the instruction")  
	CheckJavaScriptXpath = false
End Function

'-----------------------------------------------------------------
function println(Text)
  WScript.stdOut.Writeline(Text)
End function

'-----------------------------------------------------------------
function getValueOfNode (nodeName)
	
	Set xmlDoc 	= CreateObject("Msxml2.DOMDocument")
	xmlDoc.async = False
	'	# Neglect the default behaviour according to which parser trims whiteSpaces of the DataArgs if there is any,
	xmlDoc.preserveWhiteSpace = True
	
	Dim settingXmlText : settingXmlText = readTextFromFile (path2SettingXml)		
	
	'	# Loading Setting xml.
	xmlDoc.loadXML(settingXmlText)
	nodeValue = xmlDoc.selectNodes("/Settings/"&nodeName).item(0).text	
	
	getValueOfNode = nodeValue
End function

'-----------------------------------------------------------------
Const ForReading = 1

Function readTextFromFile (pathToFile)
   
	Set objFSO = CreateObject("Scripting.FileSystemObject")
	Set objTextFile = objFSO.OpenTextFile _
		(pathToFile, ForReading)
	
	strText = objTextFile.ReadAll

	objTextFile.Close
	readTextFromFile = strText
	Set objTextFile = Nothing
	Set objFSO = Nothing
End Function