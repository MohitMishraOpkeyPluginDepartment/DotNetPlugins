Dim objArgs

set objArgs = WScript.Arguments
Dim runtimelibpath
runtimelibpath = objArgs(0)
'MsgBox "runtimelibpath" &runtimelibpath


'---------------------------
Dim objWSH
Dim objUserVariables

Set objWSH =  CreateObject("WScript.Shell")
'This actually returns all the User Variables, and you either loop through all, or simply print what you want
Set objUserVariables = objWSH.Environment("USER")

'Say you want to add a System or a User variable. Pretty simple, just use the object and assign the value!
objUserVariables("runtimelibpath") = runtimelibpath
'objUserVariables("exectuionDB") = ExecutionDBPath
'objUserVariables("currentusername") = currentuser
'objUserVariables("executionTable") = execTab
OPKEY_PLUGIN = objUserVariables("OPKEY_PLUGIN")

RFTInstpath = objWSH.RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Rational Software\Rational Test\8\Rational FT Install Directory")

sCurPath = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".") 
'MsgBox "curpath" &sCurPath
'objUserVariables("sCurPath") = sCurPath
vars = "java -classpath """ & RFTInstpath & "\rational_ft.jar"";"""& sCurPath &"\Library\RFTworkspace\MyRFTProj\resources\jxl-2.6.jar"";""" & sCurPath &"\Library\RFTworkspace\MyRFTProj\resources\sqlitejdbc-v056.jar"";""" & sCurPath &"\Library\RFTworkspace\MyRFTProj\resources\rftjar.jar"" com.rational.test.ft.rational_ft -datastore """& sCurPath &"\Library\RFTworkspace\MyRFTProj"" -log ""param"" -rt.log_format ""html"" -playback ""MyScript"" "

objWSH.run "cmd /k " & vars, 0, True

Set objWSH = nothing