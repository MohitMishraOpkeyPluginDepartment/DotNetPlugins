'#########################################################
'
' Copyright (c) 2013 CresTech Software Systems Pvt Ltd
' All Rights Reserved
'
' This file is a part of OpKey or one of its plugins
'
' http://opkey.crestechglobal.com
'
' Unauthorized copying of this file, via any medium is strictly prohibited
' This file or any part of it must not be modified, altered or removed.
' 
'##########################################################







'##########################################################
'    REGION - library
'##########################################################


Function wrap(mystring)
    'This function will add a carriage return
    'and line feed to your string at intervals
    'defined by "nochars"
    Dim n, curchar, newstring, nochars
    nochars = 55
    
    For n=1 To Len(mystring)
        curchar=Mid(mystring,n,1)
        newstring=newstring & curchar
        
        If ((n/nochars) - Int(n/nochars))=0 Then
            newstring=newstring & vbCrLf & Space(24)
        End If
    Next
    
    wrap=newstring    
End Function

'---------------------------------------------------------
Sub info(message)
	msg1 = Replace(Trim(message), vbCrLf, "")
	msg2 = wrap(msg1)
    WScript.StdOut.WriteLine(Time & " (INFO)    - " & msg2)
End Sub

'---------------------------------------------------------
Sub warn(message)
	msg1 = Replace(Trim(message), vbCrLf, "")
	msg2 = wrap(msg1)
    WScript.StdOut.WriteLine(Time & " (WARNING) - " & msg2)
End Sub

'---------------------------------------------------------
Sub pass()
    info("--- Prequisite Check PASS ---")
    WScript.Quit 0
End Sub

'---------------------------------------------------------
Sub fail()
    info("--- Prequisite Check FAIL ---")
    WScript.Quit -1
End Sub

'---------------------------------------------------------
Function getPath
    getPath = WshShell.Exec("CMD /S /C path 2>&1").StdOut.ReadAll
End Function









'##########################################################
'    REGION - Main routine
'##########################################################




info(" --- Starting Java Prequisite Check ---") ' ##################

On Error Resume Next
Set WshShell = CreateObject("WScript.Shell")
MIN_VERSION = 1.7

info("locating java runtime envirornment")

strCommand = "CMD /S /C java -version 2>&1"
Set WshShellExec = WshShell.Exec(strCommand)
Output = WshShellExec.StdOut.ReadAll

javaNotExist = InStr(Output, "is not recognized as an internal or external command")
If javaNotExist > 0 Then
    '
    'java is not installed on the system. 
    'or not accessible from command prompt
    '
    warn(Output)
    info("Kindly ensure that java.exe is accessible from command prompt.")
    
    info(getPath)
    
    fail ' ##############################################################
    
    
Else ' 
    ' java exists
    '
    info("validating installation")
    
    javaValid = InStr(output, "java version")
    If javaValid > 0 Then
        '
        ' installation is correct
        '
        info("Looking for required version " & MIN_VERSION & " or above")
        
        'parsing a string like this: java version "1.6.0_21"Java(TM...
        version = Mid(Output, 15, 3)
        If IsNumeric(version) And CDbl(version) >= MIN_VERSION Then
            '
            'proper version found: PASS
            '
            info("Found Version: " & version)
            
            pass ' #####################################################
            
        Else '
            ' Proper version not found
            '
            warn("Cound not locate required java version " & MIN_VERSION & " or above")
            info("System returned: " & Left(Output, 20) & "...")
            info("Expected:        java version """ & MIN_VERSION & "...")
            
            info("Other versions of java could be installed in parallel to the default version." & vbCrLf & _
            " We require the default version to be " & MIN_VERSION & " or above." & vbCrLf & _
            " You may check java control panel for a list of all installed JREs. " & vbCrLf & _
            " The default version can be tuned by manually setting the PATH variable. " & vbCrLf & _
            " Remember to set only upto BIN folder.")            	
            
            info(getPath)
            
            fail ' ####################################################
            
        End If        
    Else '	 
        ' somethig is wrong with java installation
        '
        warn("Something is wrong with java installation.")
        info("System returned:")
        info(Output)
        info("You might have to make fresh installation of java")
        
        fail ' ########################################################
        
    End If    
End If


'if the pointer comes till here, then its an error
'the end user may see the output and may trap the error
'in the StdOut stream

warn(Err.toString)

fail ' ################################################################