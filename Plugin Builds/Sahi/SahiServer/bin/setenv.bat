@echo off
setx SAHI_HOME %1
echo Setting SAHI_HOME environmental variable as "%1"
echo %1> %temp%\opkeyinstall.dat
powershell -Command "(Get-Content -literalPath \"%SAHI_HOME%\config\sahi.properties\") -replace '{sahi_port}', '%2' | Out-File -filePath \"%SAHI_HOME%\config\sahi.properties\""
echo Setting the port details
call cmd /c start /B /d  "%SAHI_HOME%\bin" sahi.bat