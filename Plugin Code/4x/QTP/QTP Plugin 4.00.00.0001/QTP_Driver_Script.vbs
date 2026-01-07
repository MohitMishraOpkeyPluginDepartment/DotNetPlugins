Dim objArgs
set objArgs = WScript.Arguments
Dim runtimelibpath
runtimelibpath = objArgs(0)
'msgbox  runtimelibpath 

Dim currentuser 
currentuser = objArgs(1)
'msgbox currentuser

Dim execTab
execTab= objArgs(2)
'MsgBox execTab

Dim execDB 
execDB = objArgs(3)
'msgbox execDB

Dim QtpTestPath
QtpTestPath=runtimelibpath & "QtpTestDB"
'MsgBox QtpTestPath

Dim QFLPath 
QFLPath=runtimelibpath & "QTPFUNCTIONLIBRARY.vbs"
'MsgBox QFLPath

Dim ExecutionDBPath 
ExecutionDBPath=execDB
'MsgBox ExecutionDBPath
'MsgBox execTab

Dim app
Set app = CreateObject("QuickTest.Application")
app.Launch
If Not app.Launched Then ' If QuickTest is not yet open 
    app.Launch ' Start QuickTest (with the correct add-ins loaded) 
End If 
app.Visible = False ' Make the QuickTest application visible 
app.open QtpTestPath

Dim qtLibraries
Set qtLibraries = app.Test.Settings.Resources.Libraries ' Get the libraries collection object 
qtLibraries.RemoveAll
qtLibraries.Add QFLPath, 1 ' Add the library to the collection 
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFolder = objFSO.GetFolder(runtimelibpath) 
'Wscript.Echo objFolder.Path 
 Set colFiles = objFolder.Files 
 For Each objFile in colFiles 
If UCase(objFSO.GetExtensionName(objFile.name)) = "VBS" Then   
   if objFile.Name<>"QTPFUNCTIONLIBRARY.vbs" Then
      ' Wscript.Echo objFile.Name 
	QFLPath=runtimelibpath & objFile.Name
	' Wscript.Echo QFLPath
      qtLibraries.Add QFLPath, 1 ' Add the library to the collection 
    End If 
End if
 Next 


qtLibraries.SetAsDefault 

app.Test.Environment.Value("runtimelibpath") = runtimelibpath
app.Test.Environment.Value("exectuionDB") = ExecutionDBPath
app.Test.Environment.Value("currentusername") = currentuser
app.Test.Environment.Value("executionTable") = execTab
On Error Resume Next
'MsgBox "before run"
app.Test.Run
app=Nothing
'MsgBox "after run"
