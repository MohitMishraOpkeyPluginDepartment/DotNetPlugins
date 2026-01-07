'msgbox "1"
Set oShell = wscript.CreateObject("wScript.shell")
'msgbox "2"
oShell.SendKeys("{F15}")
'msgbox "3"
Set oShell = Nothing