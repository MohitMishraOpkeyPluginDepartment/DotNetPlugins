Module Main

    Sub Main(ByVal args As String())
        Try
            If args.Length > 0 AndAlso args(0) = "-PrerequisiteCheck" Then
                Console.WriteLine("PrerequisiteCheck  ")
                PrerequisiteCheck.perform(args)
                Console.ReadKey()
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

End Module