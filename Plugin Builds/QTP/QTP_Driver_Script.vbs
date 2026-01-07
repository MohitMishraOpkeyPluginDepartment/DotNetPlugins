Dim objArgs
set objArgs = WScript.Arguments
Dim runtimelibpath
runtimelibpath = objArgs(0)
'MsgBox"runtimelibpath"  &runtimelibpath 
a=Split(runtimelibpath ,"Communication.db",-1,1)
'msgbox a(0) 
Dim Qtppath
Qtppath=a(0)
Qtppath=Qtppath & "Library\"
'MsgBox "Qtppath" &Qtppath 

Dim QtpTestPath
QtpTestPath=Qtppath & "QtpTestDB"
'MsgBox QtpTestPath

Dim QFLPath 
QFLPath=Qtppath & "QTPFUNCTIONLIBRARY.vbs"
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
Set objFolder = objFSO.GetFolder(Qtppath) 
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

'app.Test.Environment.Value("runtimelibpath") = runtimelibpath
app.Test.Environment.Value("exectuionDB") = runtimelibpath

On Error Resume Next
'MsgBox "before run"
app.Test.Run
'MsgBox "after run"
app.quit
app=Nothing


