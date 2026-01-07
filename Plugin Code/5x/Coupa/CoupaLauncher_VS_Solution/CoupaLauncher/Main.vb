Module Main

    Sub Main(ByVal args As String())
        handleUftEnvVariables()
        Try
            If args.Length > 0 AndAlso args(0) = "-PrerequisiteCheck" Then
                PrerequisiteCheck.perform(args)
            Else
                Launcher.perform(args)
            End If

        Catch ex As Exception
            Console.Error.WriteLine(ex.ToString)
            Console.Out.Flush()
            Console.Error.Flush()
            Environment.Exit(-126)
        End Try
    End Sub
    Sub handleUftEnvVariables()
        Dim envDict = Environment.GetEnvironmentVariables()
        If envDict.Contains("JAVA_TOOL_OPTIONS") Then
            Dim value = Environment.GetEnvironmentVariable("JAVA_TOOL_OPTIONS")
            If value IsNot Nothing Then
                If value.Contains("-agentlib:jvmhook") Then
                    Environment.SetEnvironmentVariable("JAVA_TOOL_OPTIONS", Nothing)
                End If
            End If
        End If

        If envDict.Contains("_JAVA_OPTIONS") Then
            Dim value = Environment.GetEnvironmentVariable("_JAVA_OPTIONS")
            If value IsNot Nothing Then
                If value.Contains("jasmine.jar") Then
                    Environment.SetEnvironmentVariable("_JAVA_OPTIONS", Nothing)
                End If
            End If
        End If
    End Sub

End Module