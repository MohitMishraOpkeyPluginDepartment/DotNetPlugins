# Microsoft Developer Studio Project File - Name="pserver_w32" - Package Owner=<4>
# Microsoft Developer Studio Generated Build File, Format Version 6.00
# ** DO NOT EDIT **

# TARGTYPE "Win32 (x86) Console Application" 0x0103

CFG=pserver_w32 - Win32 Debug
!MESSAGE This is not a valid makefile. To build this project using NMAKE,
!MESSAGE use the Export Makefile command and run
!MESSAGE 
!MESSAGE NMAKE /f "pserver_w32.mak".
!MESSAGE 
!MESSAGE You can specify a configuration when running NMAKE
!MESSAGE by defining the macro CFG on the command line. For example:
!MESSAGE 
!MESSAGE NMAKE /f "pserver_w32.mak" CFG="pserver_w32 - Win32 Debug"
!MESSAGE 
!MESSAGE Possible choices for configuration are:
!MESSAGE 
!MESSAGE "pserver_w32 - Win32 Release" (based on "Win32 (x86) Console Application")
!MESSAGE "pserver_w32 - Win32 Debug" (based on "Win32 (x86) Console Application")
!MESSAGE 

# Begin Project
# PROP AllowPerConfigDependencies 0
# PROP Scc_ProjName ""
# PROP Scc_LocalPath ""
CPP=cl.exe
RSC=rc.exe

!IF  "$(CFG)" == "pserver_w32 - Win32 Release"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 0
# PROP BASE Output_Dir "Release"
# PROP BASE Intermediate_Dir "Release"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 0
# PROP Output_Dir "Release"
# PROP Intermediate_Dir "Release"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /c
# ADD CPP /nologo /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /D "_MT" /YX /FD /c
# ADD BASE RSC /l 0xc09 /d "NDEBUG"
# ADD RSC /l 0xc09 /d "NDEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /machine:I386
# ADD LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib libeay32.lib ssleay32.lib wsock32.lib gnu_regex.lib libcmt.lib /nologo /subsystem:console /pdb:"Release/pserver_w32.pdb" /machine:I386 /nodefaultlib:"libc" /out:"../pserver.exe" /libpath:"f:\inetpub\wwwroot\aps\src"
# SUBTRACT LINK32 /pdb:none

!ELSEIF  "$(CFG)" == "pserver_w32 - Win32 Debug"

# PROP BASE Use_MFC 0
# PROP BASE Use_Debug_Libraries 1
# PROP BASE Output_Dir "Debug"
# PROP BASE Intermediate_Dir "Debug"
# PROP BASE Target_Dir ""
# PROP Use_MFC 0
# PROP Use_Debug_Libraries 1
# PROP Output_Dir "Debug"
# PROP Intermediate_Dir "Debug"
# PROP Ignore_Export_Lib 0
# PROP Target_Dir ""
# ADD BASE CPP /nologo /W3 /Gm /GX /ZI /Od /D "WIN32" /D "_DEBUG" /D "_CONSOLE" /D "_MBCS" /YX /FD /GZ /c
# ADD CPP /nologo /W3 /Gm /GX /ZI /Od /D "WIN32" /D "_DEBUG" /D "_CONSOLE" /D "_MBCS" /D "_MT" /YX /FD /GZ /c
# ADD BASE RSC /l 0xc09 /d "_DEBUG"
# ADD RSC /l 0xc09 /d "_DEBUG"
BSC32=bscmake.exe
# ADD BASE BSC32 /nologo
# ADD BSC32 /nologo
LINK32=link.exe
# ADD BASE LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /debug /machine:I386 /pdbtype:sept
# ADD LINK32 kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib libeay32.lib ssleay32.lib wsock32.lib  gnu_regex.lib vld.lib libcmt.lib /nologo /subsystem:console /debug /machine:I386 /pdbtype:sept /libpath:"f:\inetpub\wwwroot\aps\src"
# SUBTRACT LINK32 /pdb:none

!ENDIF 

# Begin Target

# Name "pserver_w32 - Win32 Release"
# Name "pserver_w32 - Win32 Debug"
# Begin Group "Source Files"

# PROP Default_Filter "cpp;c;cxx;rc;def;r;odl;idl;hpj;bat"
# Begin Source File

SOURCE=..\src\access.c
# End Source File
# Begin Source File

SOURCE=..\src\adler32.c
# End Source File
# Begin Source File

SOURCE=..\src\anonproxy.c
# End Source File
# Begin Source File

SOURCE=..\src\cachefile.c
# End Source File
# Begin Source File

SOURCE=..\src\cleancache.c
# End Source File
# Begin Source File

SOURCE=..\src\connection.c
# End Source File
# Begin Source File

SOURCE=..\src\connmessages.c
# End Source File
# Begin Source File

SOURCE=..\src\dirent.c
# End Source File
# Begin Source File

SOURCE=..\src\dns.c
# End Source File
# Begin Source File

SOURCE=..\src\geturl.c
# End Source File
# Begin Source File

SOURCE=..\src\http.c
# End Source File
# Begin Source File

SOURCE=..\src\internalcmd.c
# End Source File
# Begin Source File

SOURCE=..\src\pserver.c
# End Source File
# Begin Source File

SOURCE=..\src\readconfig.c
# End Source File
# Begin Source File

SOURCE=..\src\server.c
# End Source File
# Begin Source File

SOURCE=..\src\socks.c
# End Source File
# Begin Source File

SOURCE=..\src\ssl.c
# End Source File
# Begin Source File

SOURCE=..\src\stringbuf.c
# End Source File
# Begin Source File

SOURCE=..\src\stringcache.c
# End Source File
# Begin Source File

SOURCE=..\src\url.c
# End Source File
# Begin Source File

SOURCE=..\src\usagestats.c
# End Source File
# End Group
# Begin Group "Header Files"

# PROP Default_Filter "h;hpp;hxx;hm;inl"
# Begin Source File

SOURCE=..\src\access.h
# End Source File
# Begin Source File

SOURCE=..\src\adler32.h
# End Source File
# Begin Source File

SOURCE=..\src\anonproxy.h
# End Source File
# Begin Source File

SOURCE=..\src\cachefile.h
# End Source File
# Begin Source File

SOURCE=..\src\cleancache.h
# End Source File
# Begin Source File

SOURCE=..\src\connection.h
# End Source File
# Begin Source File

SOURCE=..\src\connmessages.h
# End Source File
# Begin Source File

SOURCE=..\src\dirent.h
# End Source File
# Begin Source File

SOURCE=..\src\dns.h
# End Source File
# Begin Source File

SOURCE=..\src\geturl.h
# End Source File
# Begin Source File

SOURCE=..\src\http.h
# End Source File
# Begin Source File

SOURCE=..\src\internalcmd.h
# End Source File
# Begin Source File

SOURCE=..\src\pserver.h
# End Source File
# Begin Source File

SOURCE=..\src\readconfig.h
# End Source File
# Begin Source File

SOURCE=..\src\regex.h
# End Source File
# Begin Source File

SOURCE=..\src\server.h
# End Source File
# Begin Source File

SOURCE=..\src\socks.h
# End Source File
# Begin Source File

SOURCE=..\src\ssl.h
# End Source File
# Begin Source File

SOURCE=..\src\stringbuf.h
# End Source File
# Begin Source File

SOURCE=..\src\stringcache.h
# End Source File
# Begin Source File

SOURCE=..\src\url.h
# End Source File
# Begin Source File

SOURCE=..\src\usagestats.h
# End Source File
# End Group
# Begin Group "Resource Files"

# PROP Default_Filter "ico;cur;bmp;dlg;rc2;rct;bin;rgs;gif;jpg;jpeg;jpe"
# End Group
# End Target
# End Project
