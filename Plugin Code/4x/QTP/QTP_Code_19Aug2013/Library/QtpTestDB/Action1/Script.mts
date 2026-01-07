Dim databasepath
xmlpath =  CreateObject("WScript.Shell").ExpandEnvironmentStrings("%Temp%")
databasepath=Environment.Value("exectuionDB")
Dim execTab
execTab=Environment.Value("executionTable")
Dim currentuser
currentuser=Environment.Value("currentusername")
Set objConn = CreateObject("ADODB.Connection")
objConn.Open "DRIVER=SQLite3 ODBC Driver;Database=" & databasepath & ";Timeout=3000000"
i=0
Dim rows
Set rows = CreateObject("ADODB.Recordset")
Dim str,message,status,opvar,session,machineip,wantsnapshot,commandstring
While true	
	str="SELECT * FROM  " +  execTab + " where username = '"  + currentuser + "'"
	Set rows = objConn.Execute( str)
          If Cstr(rows.Fields("OpkeyFlag").Value) = "1" and Cstr(rows.Fields("PluginFlag").Value) = "0" Then
				commandstring = rows.Fields("CommandString").value          					  
				session = rows.Fields("Session").value			
 					message=""
					status=""
					opvar=""
					Dim lcmdstr
				   lcmdstr=lcase(commandstring)
				 
newxml = ""
XMLString = commandstring
xmlnew = split (XMLString,"""")

For i = 0 to ubound(xmlnew)
If i = 0  Then
newxml =   xmlnew(i)
else
newxml = newxml & "'" &  xmlnew(i)
End If
Next
commandstring = newxml
Dim oFSO, oFile, strText,myarr(10,10),First_Value(10) ,Second_Val(10) , tmpArray,tmpArray1
Set oFSO=CreateObject("Scripting.FileSystemObject")
Set oFile=oFSO.CreateTextFile(xmlpath &"\QTPxmlString.xml", True)
oFile.WriteLine "" &commandstring
Set xmlDoc = CreateObject("Msxml2.DOMDocument")
On error Resume nEXT
xmlDoc.load(xmlpath&"\QTPxmlString.xml")
Set ElemList1 = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:Function")

Dim callmethod
MehtodName = ElemList1.item(0).getAttribute("methodName")
callmethod=MehtodName&"(" 

Set ElemList = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:ObjectArguments/Opkey:ObjectArgument/Opkey:Object/Opkey:ChildObject/Opkey:Object/Opkey:Properties/Opkey:Property")
Set ElemList1 = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:DataArguments/Opkey:DataArgument")
 If ElemList.length = 0 and ElemList1.length = 0 and  MehtodName <> "Method_setPage"   Then
callmethod = callmethod & ")"
 End If
If ElemList.length <> 0 OR  (MehtodName = "Method_setPage"  OR MehtodName= "Method_VerifyPopUpText" OR MehtodName= "Method_Getpopuptext" OR MehtodName= "Method_dragAndDrop" OR MehtodName ="Method_dragAndDropAndWait")   then
	Dim PropVar
	PropVar = "Nothing"
	callmethod1=callmethod & Chr(34) & Chr(34)& PropVar & Chr(34)  & Chr(34)
	callmethod=callmethod & Chr(34) & Chr(34)& PropVar & Chr(34)  & Chr(34)&","
end if 


If  ElemList.length <> 0 and  ElemList1.length = 0 OR MehtodName = "Method_setPage"   Then
callmethod = callmethod1 & ")"
End If

For i=0 to   ElemList1.length-1
 If i = ElemList1.length-1 then
	callmethod=callmethod &  Chr(34)& Chr(34)&ElemList1.item(i).Text & Chr(34 ) & Chr(34)&")"
else
	callmethod=callmethod & Chr(34)& Chr(34)&ElemList1.item(i).Text & Chr(34) & Chr(34)&","
End If
Next
callmethod=Chr(34) & callmethod & Chr(34)
oFile.Close
Set oFile=Nothing
Set oFSO=Nothing

  opvarstr = Cstr(eval(eval(callmethod)))
Set oFSO=CreateObject("Scripting.FileSystemObject")

xmlpath1 = xmlpath & "\output.xml"
Set oFile=oFSO.CreateTextFile(xmlpath1, True)
oFile.WriteLine "" &returnString

Set xmlDoc = CreateObject("Msxml2.DOMDocument")
xmlDoc.load(xmlpath1)
Set ElemList = xmlDoc.selectNodes("/KeywordOutput/Result")
output = ElemList.item(0).Text
Set ElemList = xmlDoc.selectNodes("/KeywordOutput/Status")
opvar = ElemList.item(0).Text
Set ElemList1 = xmlDoc.selectNodes("/KeywordOutput/Message")
Mess = ElemList1.item(0).Text
oFile.Close
Set oFile=Nothing
Set oFSO=Nothing

                  If err.number <> 0 Then		
						status="fail"
                        message="Error at QTP Command" & err.number  
						 If err.number = Cint(13)  and lcase(opvar) = "true" Then
                              status = "pass"
                              message = Mess
							  Else
                              status = "fail"
                              message = Mess
						 End If
						
				 Elseif Instr(lcmdstr,"objectexists") or Instr(lcmdstr,"objectisenabled") or Instr(lcmdstr,"objecttextverification") or Instr(lcmdstr,"textverification") or Instr(lcmdstr,"verifypopuptext") or Instr(lcmdstr,"verifypropertyvalue") or Instr(lcmdstr,"verifylistitem") or Instr(lcmdstr,"verifylistitem") or Instr(lcmdstr,"objectexistswithinobject") or Instr(lcmdstr,"objectexistswithintable") or Instr(lcmdstr,"objectexistencedynamicwait") or Instr(lcmdstr,"checkfordialogbox") or Instr(lcmdstr,"textverificationgivenpage") or Instr(lcmdstr,"objectisvisible") or Instr(lcmdstr,"ischeckboxchecked") then
				            status="pass" 
							message=Mess
                 Elseif lcase(opvar)="false" then
					       status="fail"
                             message=Mess
				 Else
                         If Instr(commandstring,"WebBrowserOpen") or Instr(commandstring,"WindowAttachment") or Instr(commandstring,"ActivateWindow") or Instr(commandstring,"WindowAttachByUrlTitle") or Instr(commandstring,"CurrentWindowAttachment") or Instr(commandstring,"AttachWindowGivenTitleUsingRegx") or Instr(commandstring,"WindowAttachByTitle") then
					        str="update "+ execTab + "  set Session='" + Cstr(opvar) + "'  where username=" + "'"  +  currentuser + "'"
						'	msgbox cstr( err.description)
							session=opvar
						 	objConn.Execute( str)		
															
                         End if
						status="pass"	
						message=Mess
                        If instr(opvar,"Report Message False") Then
							opvar="false"
							status="fail"
							message=Mess
						End If

                   End if
		On Error Resume Next
		commandstring2 = replace(XMLString,chr(34),chr(34)&chr(34))
		           str="update " + execTab + " set Status=" + "'" +cstr(status) + "'" +",Message="+"'"+Cstr(message)+"'" +",Opvar="+"'"+Cstr(output)+"'" +",OpkeyFlag='0' , CommandString=" + "'"  + cstr(commandstring2) + "'" + " where username=" + "'"  +  currentuser + "'"
                               objConn.Execute( str)
 

				   objConn.CommitTrans()
				   str= "update " + execTab + " set PluginFlag='1'  where username=" + "'"  +  currentuser + "'"
                   objConn.Execute( str)	
				   	objConn.CommitTrans()								
        Else
			wait(0.05)	
         End if
  Wend
