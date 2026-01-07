Imports System.Text.RegularExpressions


Public Module Checkif9

    Function Java() As Tuple(Of String, Integer) 'path to java.exe, version    
        Dim javaPath = "java.exe"

        Dim p = CheckJavaAtPath(javaPath, False)
        If p IsNot Nothing Then Return p

        '
        ' plain invocation did not work.
        ' either java is not in search path, or did not work
        ' check java individually in each PATH location
        '
        Dim pathVar = Environment.GetEnvironmentVariable("path", EnvironmentVariableTarget.Process)
        Dim pathElements = pathVar.Split(";"c).ToList

        For Each itm In pathElements
            itm = itm.Trim(" "c, "\"c, "/"c, ";"c).ToLower

            p = CheckJavaAtPath(IO.Path.Combine(itm, "java.exe"), True)
            If p IsNot Nothing Then Return p
        Next

        Warn("Java not found in any of the PATH locations.")
        'Return Nothing
    End Function

    Private Function CheckJavaAtPath(ByVal javaPath As String, ByVal isAbsolute As Boolean) As Tuple(Of String, Integer)
        Dim proc As Process = Nothing
        Dim psi = procStart(javaPath)

        Try
            proc = Process.Start(psi)

            If Not isAbsolute Then
                javaPath = proc.Modules(0).FileName
            End If

        Catch ex As System.ComponentModel.Win32Exception When ex.Message.Contains("cannot find the file")
            'The system cannot find the file specified.
            ' Return Nothing

        Catch ex As Exception When ex.Message.Contains("cannot access modules")
            'A 32 bit processes cannot access modules of a 64 bit process.

            '  this happens when the java and this processa are of different bit
            '  this is not a problem for us.

        Catch ex As Exception
            Warn("Java not found at " & javaPath)
            Warn(ex.Message)
            ' Console.WriteLine(ex.ToString)
            ' Return Nothing
        End Try

        Dim stdOut = proc.StandardOutput.ReadToEnd()
        Dim stdErr = proc.StandardError.ReadToEnd
        proc.WaitForExit()
        proc.Dispose()

        Dim procOut = stdOut & stdErr
        If Not procOut.StartsWith("java version") Then
            Warn("Java does not seem right at " & javaPath)
            Warn("Unexpected output:")
            Warn(procOut)
            ' Return Nothing
        End If

        Dim javaVersion = Regex.Match(procOut, "(?<=)\d+(?=.)").Value
        If Integer.TryParse(javaVersion, Nothing) = False Then
            Warn("Could not deduce java version.")
            Warn(procOut)
            ' Return Nothing
        End If

        Dim javaVersion_1 = CInt(javaVersion)
        If javaVersion_1 < 9 Then
            Info("Java 8 or higher required. Found:")
            Info(procOut)
            'Return Nothing
        End If

        Info("Java found at " & javaPath)

        Return New Tuple(Of String, Integer)(javaPath, javaVersion_1)
    End Function

    Private Function procStart(ByVal path As String) As ProcessStartInfo
        Dim psi = New ProcessStartInfo
        With psi
            .FileName = path
            .Arguments = "-version"
            .RedirectStandardError = True
            .RedirectStandardOutput = True
            .RedirectStandardInput = True
            .CreateNoWindow = True
            .UseShellExecute = False
        End With

        Return psi
    End Function

    Private Sub Info(ByVal str As String)
        Console.WriteLine("[INFO] " & str)
    End Sub

    Private Sub Warn(ByVal str As String)
        Console.WriteLine("[WARN] " & str)
    End Sub

End Module
