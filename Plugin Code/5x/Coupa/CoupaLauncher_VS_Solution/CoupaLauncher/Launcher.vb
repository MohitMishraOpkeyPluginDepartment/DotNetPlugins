Imports System.IO

Module Launcher

    Sub perform(ByVal args As String())
        'we need only TWO thing:  webdriverPluginJarFileName  $PluginSettingXmlPath$


        '
        ' load the settings
        '
        Dim PluginSettingXmlPath = args(1)
        Dim installXmlDir = args(2)
        Dim webdriverPluginJarFileName = installXmlDir & "\" & args(0)


        Dim java_path
        Dim java_version As Integer
        Using sr As StreamReader = New StreamReader("JavaPath.txt")
            java_path = sr.ReadLine()
            java_version = sr.ReadLine()
        End Using

        Console.Write("JAVA_PATH : " & java_path & " JAVA_VERSION :" & java_version)

        ' Getting Current process ID (WebLauncher.exe)
        Dim processID = Process.GetCurrentProcess().Id
        Console.WriteLine("WebLauncher.exe <PID:" & Process.GetCurrentProcess().Id & ">")


        '
        ' now we start the java child process with WebDriver plugin
        '
        Dim DOUBLE_QUOTE = """"
        Dim javaArgs
        Dim p


        If java_version = 9 Then
            javaArgs = String.Format("--add-modules java.se.ee -jar ""{0}"" ""{1}"" ""{2}"" ", webdriverPluginJarFileName, PluginSettingXmlPath, processID)

        ElseIf java_version > 9 Then
            javaArgs = String.Format("-jar ""{0}"" ""{1}"" ""{2}"" ", webdriverPluginJarFileName, PluginSettingXmlPath, processID)

        Else
            javaArgs = String.Format("-jar ""{0}"" ""{1}"" ""{2}"" ", webdriverPluginJarFileName, PluginSettingXmlPath, processID)

        End If

        p = New Tuple(Of String, Integer)(java_path, java_version)

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
