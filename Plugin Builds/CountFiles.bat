@echo off

REM    ---------------------------------------
REM    this script returns the number of files  
REM    with a given name in a folder sub tree.
REM    ---------------------------------------

dir %1 /b /s | find /c /i /v "" > "%tmp%\~tempfile936559$.tmp"
set /P filecount=<"%tmp%\~tempfile936559$.tmp"
del "%tmp%\~tempfile936559$.tmp"

echo %filecount% file(s) found.
exit /b %filecount%