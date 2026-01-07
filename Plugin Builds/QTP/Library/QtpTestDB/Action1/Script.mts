'QTP Driver Script -  Created By: Premjeet Singh, 10 July 2013

Dim databasepath,objConn,requestKillSignal,rows,MSG_ID,query,xmlDoc,resultxml,objFSO,objFile,LogFile
Dim cmdInsert,cmdDelete,paramInsertID,paramInsertMSG,paramDeleteID

'Reset and set all global variables
Call ResetVars
Call SetVars
Call ConnectDatabase

'Send  Kill signal xml to Opkey for request
Call SendMessage("523541e8-4df3-48a8-94a4-afce7727092b",requestKillSignal)

While true
	'Receive the message from Opkey commumication database  
	Call ReceiveMessage
'The BOF and EOF properties are set to True when recordset is empty 
'http://www.w3schools.com/ado/prop_rs_bofeof.asp
	If  rows.EOF = False and rows.BOF=False Then		  
		   MSG_ID = rows.Fields("MSG_ID").value	
		   MSG = rows.Fields("MSG").value
		   ShowMessage(MSG_ID &" " &MSG)

	'Delete message after reading
			Call DeleteMessage(MSG_ID)
               
    		xmlDoc.loadXML(MSG) 
		
		'Check type of message is Kill Signal or not
    	If  instr(MSG,"EventNotificationMessage") <> 0 Then	
				Set Killsignalxml = xmlDoc.selectNodes("/Opkey:EventNotificationMessage/Opkey:event ") 
			    Dim EventId
				EventId= Killsignalxml.item(0).getAttribute("id")
				If EventId = "ce333217-c425-4e04-9889-6bb01b5c05cd"  Then       
						'Kill signal found,

						'Close the log file
						objFile.Close

						'Reset all variables
						Call ResetVars

						'Exit the test
						ExitTest      
				End If
		End If

		Set nodeListFunction = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:Function")
        Set nodeListStepNum = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:StepNumber")

		Dim callmethod
				MehtodName = nodeListFunction.item(0).getAttribute("methodName")

		Dim StepNumber
                StepNumber =  nodeListStepNum.item(0).text

				callmethod	=	MehtodName & "(" 
				Set nodeListObjProperty = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:ObjectArguments/Opkey:ObjectArgument/Opkey:Object/Opkey:ChildObject/Opkey:Object/Opkey:Properties/Opkey:Property")                
                 Set nodeListDataArg = xmlDoc.selectNodes("/Opkey:FunctionCall/Opkey:DataArguments/Opkey:DataArgument")
                 If nodeListObjProperty.length = 0 and nodeListDataArg.length = 0  Then
                      callmethod = callmethod & ")"
				End If

		'Send Nothing for Object
		If nodeListObjProperty.length <> 0   Then	
			If nodeListDataArg.length = 0   Then
				'No Data Arguments
				callmethod=callmethod & Chr(34) & Chr(34)& "Nothing" & Chr(34)  & Chr(34)& ")"
			 Else
			 'Data Arguments to be concatenated
				callmethod=callmethod & Chr(34) & Chr(34)& "Nothing" & Chr(34)  & Chr(34)&","
			End If				
		End If 	

		For i = 0  to nodeListDataArg.length-1
			'Concatenate the Data Arguments
				If i = nodeListDataArg.length-1 Then
						'Last Argument
						callmethod = callmethod &  Chr(34)& Chr(34)& nodeListDataArg.item(i).Text & Chr(34 ) & Chr(34)&")"
				Else
						'More Arguments to concat
						callmethod=callmethod & Chr(34)& Chr(34)& nodeListDataArg.item(i).Text & Chr(34) & Chr(34)&","
				End If
		Next

		callmethod = Chr(34) & callmethod & Chr(34)	
        resultxml = Cstr(eval(eval(callmethod)))		
       
		Set TypeLib = CreateObject("Scriptlet.TypeLib")
		id=TypeLib.Guid
		id = lcase(id)

			resultxml = replace(resultxml,"<StepNumber> </StepNumber>","<StepNumber> " & StepNumber & "</StepNumber>")      			 
			Call SendMessage(id,resultxml)   						
        Else		
		    	wait(0.1)
        End if	
	  Call LogError("While True")
  Wend

'Send the Message ID and Message to communication database
  Sub SendMessage(msg_id,msg)                   
			cmdInsert.CommandText = "INSERT INTO PLUGIN_TO_OPKEY (msg_id, msg) Values (?,?);"
			paramInsertID.Size = Len(msg_id)
			paramInsertID.Value= msg_id
			paramInsertMSG.Size=Len(msg)
			paramInsertMSG.Value=msg
			cmdInsert.Execute
			Call LogError("SendMessage")
  End Sub

'Recieve Message ID and Message from communication database
  Function ReceiveMessage
	 query = "SELECT MSG_ID, MSG  FROM OPKEY_TO_PLUGIN"
	 Set rows = objConn.Execute( query) 
	 Call LogError("ReceiveMessage")	 		
	 ReceiveMessage = rows
  End Function

'Delete message after receiving
   Sub DeleteMessage(id)     
	  cmdDelete.CommandText = "DELETE FROM OPKEY_TO_PLUGIN WHERE MSG_ID =  ?;"
		paramDeleteID.Size = Len(id)
		paramDeleteID.value= id      
	    cmdDelete.Execute   	
		Call LogError("DeleteMessage")
   End Sub

'Call it after setting variables to open connection with database
  Sub ConnectDatabase	
    	If Not (objConn Is Nothing)  Then		
			objConn.Open "DRIVER=SQLite3 ODBC Driver;Database=" & databasepath & ";Timeout=3000000"
            cmdInsert.ActiveConnection = objConn
			cmdDelete.ActiveConnection = objConn

			'Create parameter with dummy size 1 and value 1.
			Set paramDeleteID = cmdDelete.CreateParameter("id",200,&H0001,1,"1")   		
			cmdDelete.parameters.append(paramDeleteID)
		
			Set paramInsertID =cmdInsert.CreateParameter("idIns",200,&H0001,1,"1")	  
			Set paramInsertMSG =cmdInsert.CreateParameter("msg",200,&H0001,1,"1")	  
			cmdInsert.parameters.append(paramInsertID)
			cmdInsert.parameters.append(paramInsertMSG)			
		Else
			LogMessage("Connection not initialized")
		End If      		
		Call LogError("ConnectDatabase")
  End Sub

'Reset all variables initially.
Sub ResetVars   
		databasepath 			 = ""
		requestKillSignal 		= ""
		query							  = ""
		LogFile							= ""		
		Set objFSO				  = Nothing
		Set objFile 				  = Nothing
		Set objConn				  = Nothing
		Set rows 					  = Nothing
		Set xmlDoc				   = Nothing
		Set cmd				  		  = Nothing
		Call LogError("ResetVars")
End Sub

'Set all varialbes after resetting them.
Sub SetVars  
   On Error Resume Next	
			databasepath 			   = Environment.Value("exectuionDB")
			LogFile 			 				= replace(databasepath,"Communication.db","QTPLog.txt") 			
			Set rows					    = CreateObject("ADODB.Recordset")
			Set objConn 			   = CreateObject("ADODB.Connection")
			Set xmlDoc 					= CreateObject("Msxml2.DOMDocument")
			Set cmdDelete 			 = CreateObject("ADODB.Command")
			Set cmdInsert 				= CreateObject("ADODB.Command")
			Set objFSO					=CreateObject("Scripting.FileSystemObject")
            Set objFile					   = objFSO.CreateTextFile(LogFile,True)	
			'Store xml to request Kill signal from Opkey at execution end
			requestKillSignal = "<?xml version=""1.0"" encoding=""UTF-8""?>" & _
												"<Opkey:EventSubscriptionRequest xmlns:Opkey=""http://opkey.crestechglobal.com/xml/EventSubscriptionRequest"">" & _
												"   <Opkey:publisher id=""4f791206-7567-45cf-a982-c380ad225955"" />" & _
												"   <Opkey:event id=""ce333217-c425-4e04-9889-6bb01b5c05cd"">" & _
												"   <Opkey:name>SESSION_ENDING</Opkey:name>" & _
												"   </Opkey:event>" & _
												"   <Opkey:parameters />" & _
												"</Opkey:EventSubscriptionRequest>"		
			Call LogError("SetVars")   		
End Sub

'Return original message if no error exist, other wise return error to debug
Sub LogError(methodName)
   Dim errNum,errMsg
	 If Err.NUMBER <> 0 Then
		 errNum	= Err.NUMBER
		 errMsg 	= Err.DESCRIPTION		
		 Err.CLEAR() 
		 objFile.Write "Method Name: " & methodName & vbnewline & "Error Number: " & Cstr(errNum) & vbnewline & "Error Description: " & errMsg  & vbCrLf      	 	
	End If			
End Sub

Function LogMessage(msg)	
		 objFile.Write "Message: " & msg  & vbCrLf    	
End Function

Function ShowMessage(msg)
		'Msgbox msg
End Function












