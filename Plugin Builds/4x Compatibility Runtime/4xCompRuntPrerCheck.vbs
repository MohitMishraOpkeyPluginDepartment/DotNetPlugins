println("Starting WebDriver Prequisite Check")
set arrArgsByOpKey			=	WScript.Arguments

main()


'-----------------------------------------------------------------
sub main()
  
  if CheckJava() = false then WScript.Quit -1 
  'if ValidateDriverExe () = false then WScript.Quit -1   
  println("WebDriver Prequisite Check Passed")
End sub


'-----------------------------------------------------------------
function CheckJava()
    println("1.Checking for java")
    strCommand = "java -version"

    Set WshShell = CreateObject("WScript.Shell")
    On Error Resume Next
    Set WshShellExec = WshShell.Exec(strCommand)

    Output = WshShellExec.StdErr.ReadAll

    javaExist = InStr(Output, "java version")
    If javaExist > 0 Then
      println("Java has been found, 'checking for its version")
      version = Mid(Output,javaExist + 14, 3)
      println("Found Version: " & version)
  
      if version >= 1.7 then
        CheckJava = true  
        Exit Function
      End IF

    else

      println("")
      println("JAVA not found. Either Java is not installed, or is not present in the PATH Environment Variable")
      println("Kindly ensure that the path to JAVA.exe has been set in the PATH Environment Variable")
    
    End If

    Set WshShellExec = Nothing
    CheckJava = false
End Function

'-----------------------------------------------------------------
function println(Text)
  WScript.stdOut.Writeline(Text)
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
End Function