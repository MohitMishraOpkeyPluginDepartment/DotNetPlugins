@echo off
set CHROME="chrome"

REM Get the directory where the batch file is located
set BASE_DIR=%~dp0

REM Launch Chrome using the profile next to this batch file
%CHROME% --user-data-dir="%BASE_DIR%Chrome" --profile-directory="Default"
