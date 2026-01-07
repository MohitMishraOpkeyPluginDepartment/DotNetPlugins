Imports System.IO

Module Launcher

    Sub perform(ByVal args As String())
        'we need only TWO thing:  appiumPluginJarFileName  $PluginSettingXmlPath$


        '
        ' load the settings
        '
        Dim appiumPluginJarFileName = args(2) & "\" & args(0)
        Dim PluginSettingXmlPath = args(1)
        Dim userGivenPath As String
        Dim fileToDelete As String = "javaPath.txt"

        Dim java_path
        Dim java_version As Integer

        Dim agentJavaPath = Environment.GetEnvironmentVariable("OpKeyAgent_Java")
        Dim agentJavaVersion = Environment.GetEnvironmentVariable("OpKeyAgent_Java_Version")

        'Console.WriteLine("Enviorement variable java path : " & agentJavaPath)

        Using sr As StreamReader = New StreamReader("JavaPath.txt")
            java_path = sr.ReadLine()
            java_version = sr.ReadLine()

            'un comment for debugging
            'Console.WriteLine(vbNewLine + "Launcher JAVA_PATH : " & java_path & " JAVA_VERSION :" & java_version)
        End Using



        If String.IsNullOrEmpty(java_path) = False Then
            userGivenPath = java_path
            'Console.WriteLine("java path check user given path : " & userGivenPath)

        End If

        'ctrl +c  for commenting a line'

        If String.IsNullOrEmpty(userGivenPath) = False Then
            If File.Exists(userGivenPath) Then
                If String.IsNullOrEmpty(java_path) = False Then
                    agentJavaPath = java_path
                End If
            Else

            End If

        End If

        If System.IO.File.Exists(fileToDelete) Then
            System.IO.File.Delete(fileToDelete)
        End If



        Console.WriteLine("JAVA_PATH : " & java_path & " JAVA_VERSION :" & java_version)

        'now we will initiate according to user path '

        Dim java_process As Tuple(Of String, Integer) = Nothing

        If String.IsNullOrEmpty(agentJavaPath) OrElse String.IsNullOrEmpty(agentJavaVersion) Then
            java_process = Check.Java()
        Else
            'un comment for debugging "if there is no java installed in the system then default the agent java path will be used."'

            'Console.WriteLine(vbNewLine + "   JAVA PATH :: " + agentJavaPath)
            'Console.WriteLine(vbNewLine + "   JAVA VERSION :: " + agentJavaVersion)

            If File.Exists(agentJavaPath) Then      'if java in agent not exist then find any java installed in system'
                java_process = New Tuple(Of String, Integer)(agentJavaPath, CInt(agentJavaVersion))
            Else

                'un comment for debugging "if blank is given then default the agent java path will be used."'
                'Console.WriteLine($"Agent java '{agentJavaPath}' not exists.")'

                java_process = Check.Java()

            End If
        End If

        If java_process Is Nothing Then Throw New Exception("Java not found")














        '--------------------------------------------------------------------'

        '
        ' now we start the java child process with WebDriver plugin
        '
        Dim DOUBLE_QUOTE = """"
        Dim javaArgs



        If java_version = 9 Then
            javaArgs = String.Format("--add-modules java.se.ee -jar ""{0}"" ""{1}"" ", appiumPluginJarFileName, PluginSettingXmlPath)

        ElseIf java_version > 9 Then
            javaArgs = String.Format("-jar ""{0}"" ""{1}""  ", appiumPluginJarFileName, PluginSettingXmlPath)

        Else
            javaArgs = String.Format("-jar ""{0}"" ""{1}""  ", appiumPluginJarFileName, PluginSettingXmlPath)

        End If

        'java_process = New Tuple(Of String, Integer)(java_path, java_version)


        'Dim androidHomePath = Check.AndroidSdk
        ' If androidHomePath Is Nothing Then Throw New Exception("The ANDROID_HOME environment variable is not set to the Android SDK root directory path.Checking along PATH for adb.")


        Dim psi = New ProcessStartInfo
        psi.FileName = java_process.Item1
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


        '
        ' now wait for java to exit while pumping stdout and stderr
        '
        Console.Out.Flush()
        Console.Error.Flush()
        Environment.Exit(javaExitCode)
    End Sub

End Module