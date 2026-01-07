
println("Starting UFT Prequisite Check")
main()

sub main()
    
  If checkUFT()  = false then WScript.Quit -1 

  println("Completed UFT Prequisite Check")
End sub

Function checkUFT()
	On Error Resume Next
	
	Set uftApp = CreateObject("QuickTest.Application")
	
	If Err.Number <> 0 Then
		uftExistFlag = False
		println "Either UFT/QTP is not Installed or its license is inactive."
	Else
		println "UFT  --  Installed"
		uftExistFlag = True
		
	End IF
	checkUFT	=	uftExistFlag
End Function

'-----------------------------------------------------------------
Sub println(Text)
  WScript.stdOut.Writeline(Text)
  'Wscript.Echo Text
End Sub