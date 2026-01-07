Dim objArgs

set objArgs = WScript.Arguments
Dim runtimelibpath
runtimelibpath = objArgs(0)

Dim currentuser 
currentuser = objArgs(1)

Dim execTab
execTab= objArgs(2)

Dim execDB 
execDB = objArgs(3)

Dim ExecutionDBPath 
ExecutionDBPath=execDB

'---------------------------
Dim objWSH
Dim objUserVariables

Set objWSH =  CreateObject("WScript.Shell")
'This actually returns all the User Variables, and you either loop through all, or simply print what you want
Set objUserVariables = objWSH.Environment("USER")

'Say you want to add a System or a User variable. Pretty simple, just use the object and assign the value!
objUserVariables("runtimelibpath") = runtimelibpath
objUserVariables("exectuionDB") = ExecutionDBPath
objUserVariables("currentusername") = currentuser
objUserVariables("executionTable") = execTab
OPKEY_PLUGIN = objUserVariables("OPKEY_PLUGIN")

RFTInstpath = objWSH.RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Rational Software\Rational Test\8\Rational FT Install Directory")

sCurPath = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".") 

vars = "java -classpath """ & RFTInstpath & "\rational_ft.jar"";"""& runtimelibpath &"\RFTworkspace\MyRFTProj\resources\jxl-2.6.jar"";""" & runtimelibpath &"\RFTworkspace\MyRFTProj\resources\sqlitejdbc-v056.jar"";""" & runtimelibpath &"\RFTworkspace\MyRFTProj\resources\rftjar.jar"" com.rational.test.ft.rational_ft -datastore """& runtimelibpath &"\RFTworkspace\MyRFTProj"" -log ""param"" -rt.log_format ""html"" -playback ""MyScript"" "

objWSH.run "cmd /k " & vars, 0, True

Set objWSH = nothing