Imports System.IO

Module PrerequisiteCheck

    Sub perform(ByVal args As String())
        'we need
        '
        '  Java 7+

        '
        ' settings.xml file path in the first argument
        '
        If args.Length < 4 Then
            fail("insufficient command-line arguments. Required (0) -PrerequisiteCheck (1) path\to\settings.xml (2) opkey-pluginbase.x.x.jar (3) DefaultPluginLocation" & args.Length)
        End If

        Dim PluginSettingXmlPath = args(1)

        If Not File.Exists(PluginSettingXmlPath) Then
            fail("File not found at " & PluginSettingXmlPath)
        End If

        Dim settingsXml As XDocument = Nothing

        Try
            settingsXml = XDocument.Load(PluginSettingXmlPath)
        Catch ex As Exception
            fail("Not a valid xml file " & PluginSettingXmlPath)
        End Try

        pass("settings.xml located")

        Dim agentJavaPath = Environment.GetEnvironmentVariable("OpKeyAgent_Java")
        Dim agentJavaVersion = Environment.GetEnvironmentVariable("OpKeyAgent_Java_Version")
        Dim userDefinedJavaPath = Environment.GetEnvironmentVariable("OpKeyAgent_Java_Custom_Path")

        'un comment for debugging
        'Console.WriteLine("PRE REQUISITE CHECKING DATA IS ENTERING : " & userDefinedJavaPath)

        '
        ' check for java 7+
        '

        If String.IsNullOrEmpty(userDefinedJavaPath) = False Then
            agentJavaPath = userDefinedJavaPath

        End If



        Dim java_process As Tuple(Of String, Integer) = Nothing
        java_process = New Tuple(Of String, Integer)(agentJavaPath, CInt(agentJavaVersion))

        If java_process Is Nothing Then
            fail("Java not found")
        End If



        Using sw As StreamWriter = New StreamWriter("JavaPath.txt")
            Console.Write(sw)
            sw.WriteLine(java_process.Item1)
            sw.WriteLine(java_process.Item2)
        End Using


        'check for Andorid home variable properly set

        '        Dim androidSdkPath = Check.AndroidSdk()

        '        If androidSdkPath Is Nothing Then
        ' fail("The ANDROID_HOME environment variable is not set to the Android SDK root directory path. Checking along PATH for adb.")
        ' Else
        ' pass("Android Sdk found at " & androidSdkPath)
        ' End If

        '
        ' all check passes
        '


        pass("all check passed")
        Console.Out.Flush()
        Console.Error.Flush()
        ClassFinder.perform(args, java_process)

    End Sub

    Private Sub fail(ByVal message As String)
        Console.Error.WriteLine("[FAIL] " & message)
        Console.Out.Flush()
        Console.Error.Flush()
        Threading.Thread.Sleep(2000)
        Environment.Exit(-4039)
    End Sub

    Private Sub pass(ByVal message As String)
        Console.WriteLine("[PASS] " & message)
    End Sub

End Module
