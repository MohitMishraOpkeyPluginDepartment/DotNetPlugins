Imports System.IO

Module ClassFinder

    Sub perform(ByVal args As String(), ByVal java_process As Tuple(Of String, Integer))
        'we need only TWO thing:  webdriverPluginJarFileName  $PluginSettingXmlPath$


        '
        ' load the settings
        '
        'Dim OpkeyPluginBaseJarFileName = args(2)
        Dim _DefaultPluginLocation_ = args(3)

        Dim _DefaultPluginBaseLocation_ = System.IO.Path.GetDirectoryName(_DefaultPluginLocation_)

        Dim OpkeyPluginBaseJarFileName = _DefaultPluginBaseLocation_ & "\libs\PluginBase\" & args(2)

        Console.Write("*****************" + _DefaultPluginLocation_)
        Console.Write("*****************" + OpkeyPluginBaseJarFileName)

        Dim _SeleniumPluginPath_ = _DefaultPluginBaseLocation_ & "\Web"


        '
        ' now we start the java child process with WebDriver plugin
        '
        Dim DOUBLE_QUOTE = """"

        Dim javaArgs
        Dim p
        Dim p1 = java_process
        If CInt(p1.Item2) = 9 Then
            javaArgs = String.Format("-jar --add-modules java.se.ee ""{0}"" ""{1}"" ""{2}"" ""{3}"" ", OpkeyPluginBaseJarFileName, _DefaultPluginLocation_, OpkeyPluginBaseJarFileName, _SeleniumPluginPath_)
            p = java_process
        Else
            javaArgs = String.Format("-jar ""{0}"" ""{1}"" ""{2}"" ""{3}"" ", OpkeyPluginBaseJarFileName, _DefaultPluginLocation_, OpkeyPluginBaseJarFileName, _SeleniumPluginPath_)
            p = java_process
        End If

        If p Is Nothing Then Throw New Exception("Java not found")

        Dim psi = New ProcessStartInfo
        psi.FileName = p.Item1
        psi.Arguments = javaArgs
        psi.RedirectStandardError = True
        psi.RedirectStandardOutput = True
        psi.RedirectStandardInput = True
        psi.CreateNoWindow = True
        psi.UseShellExecute = False


        '
        ' we pump the child's stdout/stderr
        '
        Dim proc = Process.Start(psi)
        AddHandler proc.ErrorDataReceived, Sub(s, e) Console.Error.WriteLine(e.Data)
        AddHandler proc.OutputDataReceived, Sub(s, e) Console.Out.WriteLine(e.Data)
        proc.BeginErrorReadLine()
        proc.BeginOutputReadLine()
        proc.WaitForExit()
        Dim javaExitCode = proc.ExitCode

        'Console.Read()

        '
        ' now wait for java to exit while pumping stdout and stderr
        '


        Console.Out.Flush()
        Console.Error.Flush()
        Environment.Exit(javaExitCode)
    End Sub

End Module